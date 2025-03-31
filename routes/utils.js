import jwt from 'jsonwebtoken'
import fs from 'fs'
import Axios from 'axios'
// import util from "util"
import multer from "multer"


// import { uploadFileMiddleware } from "../middleware/file_upload"

//2MB please
// const maxSize = 2 * 1024 * 1024

// const privateKey = () => fs.readFileSync(require.resolve("./private.pem"), { encoding: "utf8" });
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2Zh2PUPVPpJoz
/6rmLzDkjDm+f3Sauao84DUx5weBRfba6SEuTOH+84oaSWGBu0MlQwP3WjZXM951
4DhCg/k+KscsV6+Hwq1S/o8zRRiiqeazXVAS+ER2ipKR426ndkjm1hfD3D3kSK2q
F4zX3et+EhoSOVH8mooDSzxPIA9IFAuC/6UeZg2XnteY7u9F5LmpeMAewlj+6zTO
lzEmSqvZACD808JncJck6ONxQRKQJRDi81VhTrvGoFHLRBXAYPXsEV002ELBeghp
VayI3y3f9gbHr7PZ8at4+BorLFyNrgznGxsSreGWIM3bfK7RlV/7wim2SLjqrV7w
issFjy7DAgMBAAECggEAQH2yje3ODq7gZupK/sBIxUZfVF+0VtC2xHdx14ccPDUE
pzoupTRB4+cwOUMg2sHfZ9leGaMn+4U3bu4sdjg7dCOj8KXARnwq1GF1OGeB4mG4
VEr1+P8XFeLBGBwWD9fext+D35iLuZ+I588T2W95yEWWOkNSHcJ2cdu0IzXusUjr
tXmWX50KyigxeQbmge6yNN4F2mQmYyaLcVcTnQL10cATOssWsW81WAcsZ/qfdRwS
wIueUYoln4jzYH71fnISldUOOmWrAY3/r5A6Dx85JDjoasfrqoGBzfR3HUH9Q0je
u0d1i+dI57vDC+a5Z2wYbBM/hWsrgrhyjEuDmSkCgQKBgQDrx+R7fVALtIxlVnLS
K7McCH/cDFj00rLkIFCOXpSmTQut01NXd4mO3Rk6foKRDu/4yvxHcv5mL+ns1r2f
zd3E3dZbIwGVSHLJHp24FX2HN/aYDVWP7upQk6zXvEk8zOTQJJi9zvy7xx3miDTp
xn0JonHzzi8K4PEo71lyMhSsUwKBgQDGClOkBpmJyLN7v1IuaoUuDPkgQX9Yg5No
rYqAy8rZQlsBx6L1eJCm5DLGssQUiDHeo1zARikwq6F1sAwSuO+gJ0p5b7O08x4f
5hiVUGl4TkRR1I3F2i3MS+GKzKYcu+bHbisIgzrWt5UlX6JkPaIgnERIjEkK6D0a
VS11lk+l0QKBgHpTFa4fwHSiMiitJhr2AxGrMzKl0U0LNzZ1sXV7imGRHVsMhXOe
l+ZfvSQE2JaLimKoZSRoe6Xme9WdP3n2I3VspjZYPg0GLk87rBYCSELr/Oq8GET5
beVqCEVQ8SozHw8BvaDUD3kYf+HHjrQuf1aNSdN0iCF7vIJBU0WUx/bzAoGAM+x7
N5NfaEfN/1EPXAojtwpBu1pQ6EU/Pf/aQ6CrI8GJGPNd35xn2MoWIhC25mc7JBOS
+vqqTA+D+tZYpAQHF+eVWDeYV4YyzMxIf8WgkaF7ujTPoyNsRJdUoE698uS1Qm65
K7c0kx15Jl5ntn6OZpxyLs9RS2HOu3u/uofZhDECgYA/Wn5DaCwNT0pLcHdi+5do
Zj9IZ8QBjuXqzK7/R0Bty36NzDAwGFsmGZvgxxH29cRTzMbs6Pg5wjlcvA6X/1tT
I8p2QHiF8pi4LurF4pnH1iWY6GSL95mVys3W8vyRwvB/UOSbcSMj9aDcihshLhQK
8AdtmB6OhVV+P3NmkGx86A==
-----END PRIVATE KEY-----`;

// let uploadFile = multer( { 
//     storage: storage,
//     limits: { fileSize: maxSize }
// } ).single( "file" )

// let uploadFileMiddleware = util.promisify( uploadFile )

export const generateStr = () => {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345689"
    const charactersLength = characters.length 
    let counter = 0;
    while( counter < charactersLength ) {
        result += characters.charAt( Math.floor( Math.random() * charactersLength ) )
        counter +=  1
    }
    return result
}

export const formatJWT = ( clientID, baseUrl, redirectUrl ) => {
    let current = new Date()

    //format the payload
    const payload = {
        "iat": parseInt( current.getTime() / 1000 ),
        "iss": clientID,
        "aud": baseUrl,
        "exp": parseInt( current.getTime() / 1000 ) + 7200,
        "redirect_uri": redirectUrl
    }

    //sign the jwt with the private key
    const token = jwt.sign( payload, privateKey, {
        algorithm: "RS256"
    } )
    //get the jwt token
    return token 
}

export const generateToken = async ( callback ) => {
    let basic = "dVhTUHdOZlY3Sl9HX2FZWTJQYjNPYU1LZlVZYTpDdG5nS0FRbDdQYkI0TEh3MERNdjdMVmpnaWdh"
    // let ughubtokenUrl =  `https://api-uat.integration.go.ug`
    let ughubtokenUrl = `https://intra.works.go.ug`
    try {
        const response = await Axios.post( `${ughubtokenUrl}/token`, {
            "grant_type": "client_credentials"
        }, {
                headers: {
                    Authorization: `Basic ${basic}`,
                    "Content-Type" : "application/x-www-form-urlencoded"
                }
        } )

        if( response.data ) {
           callback( response.data )
        }
    } catch (error) {}
}

export const getUgPassAccessToken = async () => {
    try {
        const response = await Axios.get( `https://auth.cert.works.go.ug/api/getAuthorization` )
        if( response.data ) {
            return response.data?.access_token 
        }
    } catch (error) {
        return null
    }
}