import jwt from 'jsonwebtoken'
import fs from 'fs'
import Axios from 'axios'
import multer from "multer"

let privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDnXv+ZmxTf7u0b
skRnaZ9tcrpvfW4kUVz+FEERIQpVw7mPEy+t+k7qUdhfa1fqMujWmRpVZggpmQBZ
FYXre0ETdYgaJBEPaANWazZrcNDZUkVfElmb8y4Cql5dGSyyCW7s0wcz8mMQ+TiO
lw8t3keIsbIjqhYZ5d+ZE6B84V0HWQ6B5sqN0QPwGxH2IB915M7KYVE+mcggLdtz
ph7Mj+OZ2aNEkY0hwybEGit0T/QFCEeMk1VfUUBhKuQyudR6S8RtnmSRlu/PuBwk
ubUxnNtpTiSo9dFIDCp27Pbcbxou3afOInqvevravrWOI2GV09nEWmWQY6He6U03
kPs3FtITAgMBAAECggEAGlN7391+fZBxGEKrd9zT0B9KyV7LRoSfgSWK1ckdpO6V
UYtMVI5zpkPTy9+p7DMIvUpEbc0jRqBrIrfJOicXG4C3EMpjyo36Oz4NviHjEadD
z3KGEbGU3abG/+7aYBOktHu6iRWeYhMJdWgIyR5Oo2Ycr+QtiZrXW1KZYzw9WpV3
FdsfMAe3kLbMkr0frHZ0RKU1P14EQFOPRFjSZ/Jhggnxs7rWF7jgbeQIjIOHUiNd
lqubfNM93NSj5lqA6TTnMixqtvDti9v1DZ6rrskD2sqtCfvTlmPkqwtmiOfkubPo
D6QDWJfZaSxlbulRLl4joGk6CORKjhGQRxXlWOBMGQKBgQD/4m3Ps3j+vSXYv2GG
4KwbVGRa2xJFJn+4UFoGfJdz7s5GLCFXThSyUzTY+y3fQtcK+s0x457KXow2LuKQ
y+pqoKhz/a37QeWVrAqZhBqmjbcMIU2mJ5eLcimcBRDPPcA34+BwV6giLdy8b6cM
+/smLK78th+kdI8WRXxwA4g7VwKBgQDnebyTEU9HroiyLMPM0DJBlZcBbGCg7wtb
i6hq0NGgpJMl+PBnuUhaDJEyu7shcBXZu06G43PAIGayTnX2sEZafA7Mcz1s0eG8
jlJNpZa2xQ0pvbJ7c7CPQ2EDbRoOmnGoO2lzrndbO22bfXxck42WW82EuYDgU1AT
SeQOAdMlpQKBgCXUevmfBf9bRXIi8S84nhk4Q9Hu22efxnggYP7egqGgJ5zWP2Oh
5otqo8CEegas4g/8fkOm7D3s9nu4OMTBcPmsoNrtIUCpQGD9W1/Q2QPQpcREVC+B
YPU7vo0TbqXE8lsQ9IiHXRMYhq7RLvhLdJjzODeiUVFF7jWTtk71JrnnAoGAZEQT
LxE8aixsAeHqHnnAizAk7PTpFkz1en4QQdSaOR+Qrc4bNJLJiFgRPQycjmtiy6Ga
7krwBLUERxA9gNHyZ5d9QYpZfR2cznRHqmKj2h+ZCA+nlFoUjLn+9+D2fITh3qF9
mCJmiRpA7C17BQ7VMeAqMee4r3LnKLPFGVwo/hECgYATgf2nhjO5U19hdJ/PZEJC
ZTBTbfjpz3NjfZsWZ/DG+IOfGV3CY0D5gsN2Ws2hJCsxAg4X5SGP6rMToDy0wbeU
/GzayJzlvKnbiqKnLLIO+GxVEkehNz4H7NpBywWpep3o71uT4QgWXzqhGFTz/31s
QQiCvf/3lzOCqpV0sWhdVw==
-----END PRIVATE KEY-----`;

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

export const formatJWT = ( clientID, aud, redirectUrl ) => {
    let current = new Date()
    
    const payload = {
        "iat": parseInt( current.getTime() / 1000 ),
        "iss": clientID,
        "aud": aud,
        "exp": parseInt( current.getTime() / 1000 ) + 7200,
        "redirect_uri": redirectUrl
    }

    const token = jwt.sign( payload, privateKey, {
        algorithm: "RS256"
    } )
    
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