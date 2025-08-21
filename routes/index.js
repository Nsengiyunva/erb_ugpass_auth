import express from 'express'
import fs from "fs";
import axios from "axios"
import { generateStr, formatJWT, generateToken, getUgPassAccessToken } from './utils.js'
import multer from "multer"
import FormData from 'form-data'
import qs from 'qs'
import dotenv from 'dotenv'
dotenv.config()


// import axios from "axios";
// import FormData from "form-data";


const clientAssertionType = `urn:ietf:params:oauth:client-assertion-type:jwt-bearer`;
const baseUrl = `https://api.ugpass.go.ug/idp`;
const aud = `https://api.ugpass.go.ug/idp/api/Authentication/token`

const signbaseUrl = `https://integration.go.ug/t/nita.go.ug/daes/1.0.0/signingservice/SignatureWebService/`
const verificationbaseUrl = `https://api.ugpass.go.ug/signing-service/SignatureWebService` 

const clientID = `yMieGGgLmhPvlxvElChn1OeAcb4fEPxvxAEyYLGIJlXvWimA`
const clientSecret = `CJykRyPwcSpRVk0kiBWShS4VD2KS1fPPEgYEEensmADSuCbPbESRcWr4ayOR2gI6`

const redirectUrl = `https://registration.erb.go.ug/redirect_auth`
const logoutURL = `https://registration.erb.go.ug/logout_auth`

const code  = `code`
const scope = `openid urn:idp:digitalid:profile urn:idp:digitalid:sign`
const state = generateStr()
const nonce = generateStr()


const router = express.Router()

//files
const storage = multer.diskStorage( {
    destination: function( _,  cb ) {
        cb( null, "/" )
    },
    filename: function( _, file, cb ) {
        cb( null, `${file.originalname}`)
    },
} )

const upload = multer( { storage } )

//file upload
router.get( "/", async ( _, res ) => {
    try {
        res.status( 200 ).send( {
            message: "This is the ERB Server..."
        } )
    } catch ( error ) {
        res.status( 500 ).send( {
            error
        } )
    }
} )

//create an authorization endpoint
router.get( `/authorization`, async ( _, res ) => {
    const authUrl = `${baseUrl}/authorization?client_id=${clientID}&redirect_uri=${redirectUrl}&response_type=${code}&scope=${scope}&state=${state}&nonce=${nonce}&request=${formatJWT( clientID, baseUrl, redirectUrl )}`
    res.status( 200 ).send( {
        "url": authUrl,
        "state": state,
        "code": code
    } )
} )



//generate ughub token
router.get( `/getToken`, async ( _, res ) => {
    try {
        // const response = await axios.post( `${ughubtokenUrl}/token`, {
        //     "grant_type": "client_credentials"
        // }, {
        //         headers: {
        //             Authorization: `Basic ${basic}`,
        //             "Content-Type" : "application/x-www-form-urlencoded"
        //         }
        // } )
        
        // if( response?.data ) {
            return res.status( 200 ).json( {
                token: formatJWT( clientID,aud,redirectUrl )
            } )
        // }
    }
    catch( error ) {
        res.status( 500 ).json( {
            "message": "An error occured"
        } )
    }
} );


//get the Json web token
router.get( `/getJWT`, async ( _, res ) => {
    try {
        const jwt = formatJWT( clientID, baseUrl, redirectUrl )
        res.status( 200 ).send( {
            jsontoken: jwt
        } )
    } catch (error) {
        res.status( 500 ).send( {
            error
        } )
    }
} )

//authorization code
router.post( `/getAuthorizationCode`, async ( req, res ) => {

    const payload = {
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: redirectUrl,
        client_id: clientID,
        client_assertion_type: clientAssertionType,
        client_assertion: formatJWT( clientID,aud,redirectUrl )
    };
    
    let data = qs.stringify(payload);
    
    // res.status( 200 ).json( {
    //     data
    // } );
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${baseUrl}/api/Authentication/token`,
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data
      };
      
      axios.request(config)
      .then((response) => {
        let result = JSON.stringify( response.data );
        res.send( {
            status: "success",
            result,
            payload
        } );
      })
      .catch((error) => {
        res.send( {
            status: "failed",
            error,
            payload
        } );
      });
} );

router.post( `/sign-with-agent`,  async( req, res  ) => {
    
const { access_token, email_address }  = req.body
// async function signSinglePdf(accessToken, userInfo) {
  console.log("==== Sign Single PDF ====");
  console.log("Signing document: sample.pdf");
  console.log("\nIMPORTANT: You will receive a notification in your UGPASS mobile app.");
  console.log("Please enter your signing PIN and submit.\n");

  const jsonData = {
    documentType: "PADES",
    id: email_address,
    placeHolderCoordinates: {
      pageNumber: 1,
      signatureXaxis: 400.0,
      signatureYaxis: 450.0,
    },
  };

  try {
    if (!fs.existsSync("sample.pdf")) {
      console.error("[ERROR] 'sample.pdf' not found in the current directory.");
      return;
    }

    const form_data = new FormData();
    form_data.append("model", JSON.stringify(jsonData));
    form_data.append("file", fs.createReadStream("sample.pdf"), {
      filename: "sample.pdf",
      contentType: "application/pdf",
    });

    const response = await axios.post(
       `http://10.255.3.133:8177`, // like settings.SIGNING_SERVICE_URL
       form_data,
      {
        headers: {
          ...form_data.getHeaders(),
          UgPassAuthorization: `Bearer ${access_token}`,
        },
        // Note: in axios, SSL verify=false -> rejectUnauthorized: false (use only if needed)
        httpsAgent: new (await import("https")).Agent({ rejectUnauthorized: false }),
      }
    );

    const responseData = response.data;

    if (responseData.success) {
    //   console.log("[SUCCESS] Document signed successfully.");
        const base64Pdf = responseData.result;
        const pdfBytes = Buffer.from(base64Pdf, "base64");
        const outputFilename = "sample_signed.pdf";
        fs.writeFileSync(outputFilename, pdfBytes);
    //   console.log(`Signed document saved as: ${outputFilename}`);
        res.status( 200  ).json( {
            result: response.data
        } )
    } else {
    //   console.error(
    //     `[FAILURE] Document signing failed: ${responseData.message || "No message"}`
    //   );
    res.status( 200  ).json( {
        error : response.data
    } )
    }
  } catch (err) {
    // if (err.code === "ENOENT") {
    //   console.error("[ERROR] 'sample.pdf' not found in the current directory.");
    // } else if (err.response) {
    //   console.error(
    //     `[ERROR] Request failed with status ${err.response.status}: ${err.response.statusText}`
    //   );
    // } else {
    //   console.error(`[ERROR] An unexpected error occurred: ${err.message}`);
    // }
    res.status( 200  ).json( {
        error: err
    } )
  }
// }

}  )



//get user info
router.get( `/getUserInfo`, async ( _, res ) => {
    let ughubtoken = generateToken()
    const UgPassAccessToken = getUgPassAccessToken()

    try {
        const response = await axios.get( `${ughubaseUrl}/api/UserInfo/userinfo`, {
            headers: {
                UgPassAuthorization: `Bearer ${UgPassAccessToken}`,
                Authorization: `Bearer ${ughubtoken}`,
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/jwt"
            }
        } )
        if( response.data ) {
            res.status( 200 ).json( {
                data: response.data
            } )
        }
    } catch (error) {
        res.status( 500 ).json( {
            error
        } )
    }
} )

//logout ugpass
router.get( `/logout`, async ( _, res ) => {
    let IDToken = ""
    try {
        const response = await axios.get( `${baseUrl}/OIDCLogout?id_token=${IDToken}&post_logout_redirect_uri=${logoutURL}&state=${state}` )
        if( response.data ) {
            res.status( 200 ).json( {
                data: response.data
            } )
        }
    } catch (error) {
        
    }
} ) 

//JWKS Url
router.get( `/jwks`, async ( _, res ) => {
    try {
        const response = await axios.get( `${baseurl}/api/Jwks/jwksuri` )
        if( response.data ) {
            // res.status( 500 ).json()
        }
    } catch (error) {
        // res.status( 500 ).json( {} )
    }
}  )

//signing base url
router.get( `/signing`, async ( req, res ) => {
    let ughubtoken = generateToken()
    let ugpasstoken = getUgPassAccessToken()

    try {
        const response = await axios.post( `${signbaseUrl}/api/digital/signature/post/sign`, {
            documentType: "PADES",
            subscriberUniqueId: "",
            placeHolderCoordinates: "",
            pageNumber: 1,
            signatureXaxis: "",
            signatureYaxis: ""
        }, {
            headers: {
                Authorization: `Bearer ${ughubtoken}`,
                UgPassAuthorization: `Bearer ${ugpasstoken}`,
                "Content-Type": "multipart/form-data"
            }
        } )

        if( response.data ) {

        }

    } catch (error) {
        
    }
} ) 

//verification base url
router.get( `/verification`, async ( _, res ) => {
    try {
        const response = await axios.post( `${verificationbaseUrl}/api/digital/signature/post/verify`, {
            documentType: "PADES",
            docData: "",
            signature: "",
            subscriberUid: ""
        } )
        if( response.data ) {

        }
    } catch (error) {
        
    }
} )


router.post( `/ugpass_access_token`, async ( req, res ) => {
    try {
        const response = await axios.post( `${proxyUrl}/t/nita.go.ug/daes/1.0.0/idp/api/Authentication/token`, 
            req.body.params, {
            headers: {
                Authorization: `Bearer ${req.body.token}`,
                "accept": "/",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        } )

        if( response.data ) {
            res.status( 200 ).send( response?.data )
        }
    } catch ( error ) {
        res.status( 500 ).send( error )
    }
} )


router.post( `/sign_document`, upload.single( "file" ), async ( req, res ) => {
    const data = new FormData();
    data.append( "file", req.file )
    data.append( "model", req.body.model )

    //config
    let config = {
        method: 'POST',
        maxBodyLength: Infinity,
        url: 'https://intra.works.go.ug/daes/1.0.0/signing-service/SignatureWebService/api/digital/signature/post/sign',
        headers: { 
          'Content-Type': 'multipart/form-data', 
          'Authorization': `Bearer ${req.body.token}`, 
          'UgPassAuthorization': `Bearer ${req.body.accessToken}`, 
          ...data.getHeaders()
        },
        data
    };

    //updates the server
    axios.request( config ).then( ( response ) => {
        res.status( 201 ).send( response.data )
    } )
    .catch( ( error ) => {
        res.send( error )
    } );
} ) 


router.post( `/verify_document`, async( req, res ) => {
    try {
        const response = await axios.post( `${verificationbaseUrl}/api/digital/signature/post/verify`, {
            documentType: req.body.documentType,
            docData: req.body.docData,
            signature: "",
            subscriberUid: req.body.subscriberUid
        } ) 

        if( response.data ) {
            res.status( 200 ).send( response.data )
        }
    } catch (error) {
        res.send( error )
    }
} ) 

router.post( `/logout_daes`, async( req, res ) => {
    try {
        const response = await axios.get( `${baseUrl}/OIDClogout?id_token_hint=${req.body.idToken}&post_logout_redirect_uri=${logoutURL}&state=${req.body.state}` )
        if( response.data ) {
            res.status( 200 ).send( response.data )
        }
    } catch (error) {
        res.send( error )
    }
}  )

export default router

