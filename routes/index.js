import express from 'express'
import fs from "fs";
import path from "path";
import axios from "axios"
import { generateStr, formatJWT, generateToken, getUgPassAccessToken } from './utils.js'
import multer from "multer"
import FormData from 'form-data'
import qs from 'qs'
import dotenv from 'dotenv'
import { engineers } from "./fixtures.js";
import authMiddleware from "../middleware/auth_middleware.js";
import ERBEngineer  from '../models/ERBEngineer.js';

// import  { bulkSignDocuments } from '../controllers/bulk_sign_controller.js' 

dotenv.config();

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "/app/uploads");
    },
    filename: (req, file, cb) => {
      const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
      cb(null, `${Date.now()}-${sanitized}`);
    },
  });
  


const fileFilter = (req, file, cb) => {
    if ( file.mimetype === "application/pdf" ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
}  );


const formatDateLong = (date) => {
    const day = date.getDate();
  
    // Get ordinal suffix
    const suffix =
      day % 10 === 1 && day !== 11 ? "st" :
      day % 10 === 2 && day !== 12 ? "nd" :
      day % 10 === 3 && day !== 13 ? "rd" : "th";
  
    // Format month + year
    const month = date.toLocaleString("en-UG", { month: "long" });
    const year = date.getFullYear();
  
    return `${day}${suffix} ${month} ${year}`;
}

const calcExpiryDate  = (type, date)  =>  {
    if( date  ){
        let year = date.getFullYear();

        switch( type?.toLowerCase()  ){
            case "registered":
            case "temporary":
                let last_day = new Date(year, 11, 31);
                return { expiry:formatDateLong(last_day), actual: last_day };
            case "techinician":
            case "technician":
            case "technologist":
                date.setFullYear( date.getFullYear() + 3 );
                let exp_day = new Date(date.getFullYear(), 11, 31);
                return { expiry: formatDateLong(exp_day), actual: exp_day };
            default:
                return 
        }
    }
}

const getStatus = (expiryDate)  => {
    const now = new Date();       // current date & time
    const exp = new Date(expiryDate);
  
    return exp >= now ? "Active" : "Expired";
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
 

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
    
const { access_token, email_address,  role }  = req.body

    if (!fs.existsSync("sign_license.pdf")) {
        console.error("[ERROR] 'sign_license.pdf' not found in the current directory.");
        return;
    }

    let data = new FormData();
    // data.append('model', '{\n  "documentType": "PADES",\n"id": "'+email_address+'",\n"placeHolderCoordinates": {\n   "pageNumber": "1",\n    "signatureXaxis": "50.0",\n    "signatureYaxis": "625.0"\n  }\n}');
    if( role  === "CHAIRMAN" ) {
        data.append(
            "model",
            JSON.stringify({
              documentType: "PADES",
              id: email_address,
              placeHolderCoordinates: {
                pageNumber: "1",
                signatureXaxis: "55.0",  //50
                signatureYaxis: "650.0",
              },
              esealPlaceHolderCoordinates: {
                pageNumber: "1",
                signatureXaxis: "215.0", //220
                signatureYaxis: "600.0" //700
             }
            })
        );
    }
    else {
        data.append(
            "model",
            JSON.stringify({
              documentType: "PADES",
              id: email_address,
              placeHolderCoordinates: {
                pageNumber: "1",
                signatureXaxis: "350.0", //400
                signatureYaxis: "650.0",
              },
            })
        );
    }
    
    data.append('multipartFile', fs.createReadStream('sign_license.pdf'));

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://nita.ugpass.go.ug/ERB-Agent/api/digital/signature/post/sign',
        headers: { 
            'UgPassAuthorization': `Bearer ${access_token}`, 
            ...data.getHeaders()
        },
        data : data
    };

    axios.request(config)
    .then((response) => {
        let result = JSON.stringify(response.data);
        res.status(200).json({
            success: true,
            result
        })
    })
    .catch((error) => {
        console.log("error",error);
        res.status(500).json({
            success: false,
            error
        })
    });
}  )

//embed a qr-code
router.post( `/add_qr_code`,  async( req, res  ) => {
    
    const { access_token }  = req.body
    
        if (!fs.existsSync("sign_license.pdf")) {
            console.error("[ERROR] 'sign_license.pdf' not found in the current directory.");
            return;
        }
    
        let data = new FormData();

        data.append(
        "model",
        JSON.stringify({
            qrPlaceHolderCoordinates: {
            pageNumber: "1",
            signatureXaxis: "400.0",
            signatureYaxis: "250.0",
            imageWidth: "100.0",
            imageHeight: "100.0"
            },
            qrData: {
            publicData: JSON.stringify({
                name: "John Doe",
                licenseNo: "ENG-2025-0041",
                issued: "2025-10-01",
                expires: "2027-10-01"
            }),
            privateData: JSON.stringify({
                dob: "1998-04-21",
                nationalId: "1234567890123456",
                email: "john.doe@example.com",
                phone: "+256700000000",
                internalRecordId: "REC-990123"
            })
            }
        })
        );
        
        // data.append('multipartFile', fs.createReadStream('sign_license.pdf'));
    
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://nita.ugpass.go.ug/ERB-Agent/api/digital/signature/post/embed/qr',
            headers: { 
                'UgPassAuthorization': `Bearer ${access_token}`, 
                ...data.getHeaders()
            },
            data : data
        };
    
        axios.request(config)
        .then((response) => {
            let result = JSON.stringify(response.data);
            console.log("qr-code-please", result);
            res.status(200).json({
                success: true,
                result
            })
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({
                success: false,
                error
            })
        });
}  )


//bulk sign implementation
router.post( `/bulk-sign`, async(req,  res ) =>  {
    try {
        let { access_token, email_address, role  }  = req.body
        let correlationId = randomInt(100, 10000000);
        let data = new FormData();

        if (!access_token) {
            return res.status(401).json({ error: 'Missing UGPass Access Token' });
        }

        if( role  === "CHAIRMAN" ) {
            data.append(
                "model",
                JSON.stringify({
                    sourcePath: "/var/ugpass/source",
                    destinationPath: "/var/ugpass/destination",
                    id: email_address,
                    correlationId: correlationId,
                    placeHolderCoordinates: {
                    pageNumber: "1",
                    signatureXaxis: "65.0", //50
                    signatureYaxis: "646.0", //625  -reduce
                    },
                    esealPlaceHolderCoordinates: {
                        pageNumber: "1",
                        signatureXaxis: "220.0", //from 218s
                        signatureYaxis: "646.0"
                    }
                })
            );
        }
        else {
            data.append(
                "model",
                JSON.stringify({
                    sourcePath: "/var/ugpass/source",
                    destinationPath: "/var/ugpass/destination",
                    id: email_address,
                    correlationId: correlationId,
                    placeHolderCoordinates: {
                        pageNumber: "1",
                        signatureXaxis: "385.0",
                        signatureYaxis: "646.0", //630 - 646
                    },
                })
            );
        }

        let config = {
            method: 'POST',
            maxBodyLength: Infinity,
            url: 'https://nita.ugpass.go.ug/ERB-Agent/api/digital/signature/bulk/sign',
            headers: { 
                'UgPassAuthorization': `Bearer ${access_token}`,
                ...data.getHeaders()
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                let result = JSON.stringify(response.data);
                console.log( "bulk sign",  result  );
                res.status(200).json({
                    success: true,
                    result
                })
            })
            .catch((error) => {
                console.log("error bulk sign: ",error);
                res.status(500).json({
                    success: false,
                    error
                })
            });
    } catch (error) {
        res.status( 500 ).json( {
            success: "failed",
            error
        }  )
    }
} );

//check bulk  status
router.post( `/bulk-status`, async ( req, res )  =>  {
    // try {
        let { access_token, correlationId  }  = req.body

        if (!access_token) {
            return res.status(401).json({ error: 'Missing UGPass Access Token' });
        }

        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: `https://nita.ugpass.go.ug/ERB-Agent/api/digital/signature/bulk/sign/status/${correlationId}`,
            headers: { 
                'UgPassAuthorization': `Bearer ${access_token}`,
                ...data.getHeaders()
            }
        };

        axios.request(config)
            .then((response) => {
                // let result = JSON.stringify(response.data);
                console.log( "bulk sign status",  result  );
                res.status(200).json({
                    success: true,
                    result
                })
            })
            .catch((error) => {
                console.log("error bulk status: ",error);
                res.status(500).json({
                    success: false,
                    error
                })
            });
    // } catch (error) {
    //     res.status( 500 ).json( {
    //         success: "failed",
    //         error
    //     }  )
    // }
} )


router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }
  
    return res.json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        url: `/uploads/${req.file.filename}`,
      },
    });
});


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

router.get( `/verify_license/:license_no`, authMiddleware, async( req, res ) => {
    // try {
    //     let engineer =  engineers?.filter( item => {
    //         if( item.type === "registered" )  {
    //             return parseInt( item.reg_no ) === parseInt( req.params.license_no )
    //         }
    //         return item.reg_no === req.params.license_no
    //     }  ).map( person => {
    //         let formatted_date = new Date( person.registration_date  )
    //         let expiry_date = calcExpiryDate( person?.type, formatted_date  );

    //         return {
    //             expiry_date: expiry_date?.expiry,
    //             status: getStatus( expiry_date?.actual ),
    //             ...person,
    //         }
    //     } )

    //     if( engineer.length  > 0 ) {
    //         res.status( 200  ).json( engineer )
    //     }
    //     else {
    //         res.status( 400  ).json( {
    //             message: `Engineer with the registration number ${req.params.license_no} was  not found`
    //         } )
    //     }
        
    // } catch (error) {
    //     res.status( 500  ).json( {
    //         message: `Engineer with the registration number ${req.params.license_no} was  not found`
    //     } )
    // }
    try {
        const { license_no } = req.params;
    
        // Fetch engineer from DB
        const engineer = await ERBEngineer.findOne({
          where: {
            reg_no: license_no,
          },
          raw: true, // return plain object
        });
    
        if (!engineer) {
          return res.status(404).json({
            message: `Engineer with the registration number ${license_no} was not found`,
          });
        }
    
        // Format dates & calculate expiry
        const formattedDate = new Date(engineer.reg_date);
        const expiryData = calcExpiryDate(engineer.type, formattedDate);
    
        const response = {
          ...engineer,
          expiry_date: expiryData?.expiry,
          status: getStatus(expiryData?.actual),
        };
    
        return res.status(200).json(response);
      } catch (error) {
        // console.error(error);
        return res.status(500).json({
          message: 'Internal server error',
        });
      }
} )


export default router;