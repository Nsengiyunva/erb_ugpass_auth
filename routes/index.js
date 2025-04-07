import express from 'express'
// import needle from 'needle'
import axios from "axios"
import { generateStr, formatJWT, generateToken, getUgPassAccessToken } from './utils.js'
import multer from "multer"
import FormData from 'form-data'
// import fs from "fs"

const consumerKey = "vIM5ulvxqRylVRkj4AWWDJyDJtoa"
const secretKey = "D32IEain1O9sqwoHDbNG8De1z2Qa"
let basic = "NmN1Z3RfNjNGYlZTeTNTRzBSeHR4TWh1T0JFYTpCTlVCcG90Mzk5S29FckR5X3pTZzRuaDhDa0Fh"
const clientAssertionType = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"


const baseUrl = `https://stgapi.ugpass.go.ug/idp`
const aud = `https://stgapi.ugpass.go.ug/idp/api/Authentication/token`
const ughubaseUrl = `https://api-uat.integration.go.ug/t/nita.go.ug/daes/1.0.0/idp`
const ughubtokenUrl = `https://api-uat.integration.go.ug`
const proxyUrl = `https://intra.works.go.ug`
const signbaseUrl = `https://api-uat.integration.go.ug/t/nita.go.ug/daes/1.0.0/signingservice/SignatureWebService/`
const verificationbaseUrl = `https://stgapi.ugpass.go.ug/signing-service/SignatureWebService` 

const clientID = `aUdRFvdXrSQGmmemdFXDdD6S65lrMFFHBOMxMRLP50MJL9MD`
const clientSecret = `6mM1PXYsD9tyEj0Iap9B028cP8oCgB8a4uM6vWUKDFbakKjw5xhhfE5feHSw0erJ`
const redirectUrl = `https://registration.erb.go.ug/redirect_auth`
const logoutURL = `registration.erb.go.ug/logout_auth`

const code  = `code`
const scope = `openid urn:idp:digitalid:profile urn:idp:digitalid:sign`
const state = generateStr()
const nonce = generateStr()


const router = express.Router()

//files
const storage = multer.diskStorage( {
    destination: function( _, file, cb ) {
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
        const response = await axios.post( `${ughubtokenUrl}/token`, {
            "grant_type": "client_credentials"
        }, {
                headers: {
                    Authorization: `Basic ${basic}`,
                    "Content-Type" : "application/x-www-form-urlencoded"
                }
        } )

        if( response?.data ) {
            return res.status(200).json( {
                data: response?.data
            } )
        }
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
    let fetchedCode = req.body.code


    const payload = {
        grant_type: "authorization_code",
        code: fetchedCode,
        redirect_uri: redirectUrl,
        client_id: clientID,
        client_assertion_type: clientAssertionType,
        client_assertion: formatJWT(clientID,aud,redirectUrl)
    };
    
    try {
        const response = await axios.post( 
            `${baseUrl}/api/Authentication/token`, 
            payload, 
            {
                headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        } )
        
        console.log( "response", response )

        console.log( "result", response?.data )
        
        res.send( response );       

     } catch ( error ) {
        console.log( "error", error )
        // res.json( {
        //     error,
        //     payload
        // } )
    }
} );



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

