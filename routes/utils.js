import jwt from 'jsonwebtoken'
import fs from 'fs'
import Axios from 'axios'
// import util from "util"
import multer from "multer"


// import { uploadFileMiddleware } from "../middleware/file_upload"

//2MB please
// const maxSize = 2 * 1024 * 1024

// const privateKey = () => fs.readFileSync(require.resolve("./private.pem"), { encoding: "utf8" });
// const privateKey = `-----BEGIN PRIVATE KEY-----
// MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCoxYTdErcWT1gW
// aRaWlATnoVxHWw9s5C2fHqGE/zjYvNJRtNyic0xPMzecqmgq+A65kG2QQQQBaDW9
// x4YRw65br4URe15FxfZP5CAzFC1JrAGtTbny58g/f+e63PwdsEeds4SbxyMkQtgk
// aezChfC98VKF3jo690kzWyEVkKyYne5e71qEzJE9+djZd3eH8cL+0ZLev1pq3wXP
// aF4v7xUvWit4wZI1DjgpxoszDNygSjTT92X+u6Her8oCrhzPGaUbln4VSAKqHPeW
// 5t/j5M5TuL1/uuJgqpgEQhRr51Vvqw2pH0c3UeOxl2PzBkdtfjrOzasVbqiG/P2K
// kOlXtcAnAgMBAAECgf9kNOKuYG5U0Md8hujifwBqh2RC+c4u2Uw9LfK5BNC732EB
// ImHeEpc8byyV2JgA60fS5e4nuHKoYzeFdvIjmgvsZEqeFqHiy6dzx/9WVKSPGZHl
// VEET+IrtKQRt7sfC2OesuuoBlDtJTGcJN9tbpCtMm/xjf48Tc8ACvhjmtP/FnQh+
// guRvCkxk21N2OyOhOfoudmLt8VnjH2oa6EeAAveu3Oyl8aNaiSvo/awtqADjJ2p8
// ENL4sT1J8gavY10lMwwEvydO6IZNDT+MI5XGA3Ey/7fKf3Rm0bpig+WIBSb3qmmL
// p6ldd84PA7tjk5/Ium4MVEVf1lHrLEdKC3ZkgsECgYEA3sOB5J4B3HwjwLj9vd7Z
// 2V0W2b/104qQ/XzA9Bs76o60DO7Gwb8JtMAcI9JyuLU6buBUnlKYQJ80PZbkfo5w
// o6RPaaT+EqBsXaKkt/jFEk3LMUL4h/agT2kAuOB6D/yST9e+XpPapa7SjmulCds9
// uQ0GcHUYksWrsVB5hP7qYIsCgYEAwfPGEqArKDyFuUZGL8opaqD9IpDCUUSPNWmw
// 30oazNN18DROiuhAQqlkXqvWdzaV/9LTGiLY62KKLQsXAmgh8fDja+zQ9Lzt/f9l
// TR5TlO2bKTkG/fOvHihRucgy212CNQqHS/kkbfdIjhzBN+k8xy+oYC2gtHtvSBR+
// jAf/VlUCgYBHZMlgh/N4wqCCx8cq7x1KuLb2GruijKpjU3RTx9awGgRCkNRKi/uE
// Xn2mTXBPGmYb2vHDvBznuR55Dr80gFpBWAvLhAGZ3qhcah/4hlZCw4P3ycr1aGmA
// idqdZfQ4423RAQgWL7THnPwGgSFnw0hI4o/Jwv2ZLJkWPwBzS2+6eQKBgQC9HRL/
// SkmKfCjvlMQPCRIFNGBeecPfNfhlXl7l+f3TxkRzKK2E6BzwYvbJEMiXiRQNU+Ye
// z+eu7HBKp0uSPzMKE5XMwCam3Ck6xvJhlbZtupjWQxK8QAV6ZFn7ymc8WhsB2Pg/
// bfjFeJ64YvVLrRJkLeYBkbvm/4xsPf9+TrX72QKBgCDKFbTFYNjJxUbX3hp9TUuR
// SFK+oVO3RT04CzsggglwFBGOwL/m1wIwD1JAcGlZlvRdfSE76QvvTzIqH8rb27IH
// 87ubF8zvh7mzzcTfh+BDNFqdEgRBIjXqCRVBjkC5Gvga+XvzNRe0EEJgGLCCijHi
// EVCZRSD78JCu2je20sXk
// -----END PRIVATE KEY-----`;

const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDmdw0MtR1RpZ3y
ZkJCrJgZ+b6a/pts9UQipx0DIg9nn5HNVcMJ3OHY/UeOhdhfeW1eqUze4j/vtkdE
3V2x9cv5A+lyJuCHjzDbHImYF3Cg3x2+9HYo9HBtb7hfjw2YvLG67RL05nW14egQ
dNj9GVe0jIep5823YkAoyd42+umAekpD/yvrJoEYemZNYN67muqErvUkAE1U8/M3
h8O734ryqUF+7py5Fx12WpxcPwnhYw6iVTUyNE6K6f42O8qVmmIvwEGXZCXrR3sQ
km7U21lh9gEHFtYphOgpgbXnP3Beq/1z7UA2/YO4/qC2UzC5f28DIB9Y5Z1jxPmI
q8o8o/ghAgMBAAECggEAGkoyXuS6N3ohDmnD3T87CpuGtr+ck01XPGy7zoOwJi35
v+asnQ9pZAtggk2aZSnA5C+D6Vj92iZ88sodyhMz9XAQzUjKDCy1cglLWOIzouZQ
yluwrvNTb+hyq9PxxR6hV6V7qBwyCVF/24C40AZ4DsyJHUSoHudCUmTUyIjO4izZ
pBgHWKlGe2kFFgcpshg3o1RIG5McMPnDA9qEyvAWNJP5VIwtOI0rAxL1mIrdMVUO
BqdyOlonvDyeo9rTw+1PHheiiBGWqu0af8YDCmLI7rAQBjIZknyIpGV6iNUVQkxz
2E2pIkoj0gt3bs/svlTtHAdao2ALwdKEOXnMYJ3nAQKBgQD5hGoUxNzHoavLX2br
P6Tt8Bn1LyH18kUDog/KSId1iNvIjnzgbwtl6nO6kIKhK7B0Tv8dCslknZwl5qgL
MXybeG2BYTq9opwTU5ZTrmhl5mm+5W9slM/LT8kDDy9JLrHTybJ7o/WyKiMruRAm
sCwpN9cWLJv9Q7uc8Jl7SjntOQKBgQDsc+q3hQ0TS0RiQYVCv2wiQ1xQFwBRfiXT
3Dr/+a7ib+RIBcKgDFOkXLdUdUqGsye8TfGp95n15ghNRLTFUtIzWuj8w2AaMUFX
InaZbKcpIARKIq1PZjO0TyuniH7kOr1GIRHDngNc/STSvKIc3Hp3NUkU2+4ofCQA
RoEOE57KKQKBgQDUQ1kbIf3PtjE3aYlcR2A/Kipq8hWp7NfZJ1zXcKwLyMlv7Ac/
xjekE7cv1w/JnCkYSLuuMSbyeUIE3BvIqeifOeuuTNBz0omDx2/y8EPPrBv5UaVg
cZf0FYOjHp/TWe3dhZBYrjqtvjr9Twn2X5ix19cZ/gkVgzFvaR6oS5TLwQKBgQCv
IA9Yiv+rKZTlXPew/wu8uL03SEHhGZg0uKkuCyQ+63Zc7X8/gMG2O0FBGXnwF+K3
Mddp9kuedxfw+pEUkInEpXFoO+ACpjZprcm/SlzoNaFXsyU/aEelJPoFJDAvI14q
AbYhdvewuIC8YB+FVrqRbfLJszZJ39/eIFnXLiruOQKBgQCW4kWTKdVSYKcGKPB6
ivNejK+sTWpQDE4c/Yj4C6M7cHljNWfRc9I19+WPUDuno2c9r+hUBNOo/0w1htgn
ud+0pEwVZ/3Uuf9zHuwgeJwXXxzgh0PYm18ar8LuIxN5RVb47r21c5sDZ9AMIIyR
bNQ0r7UlDgTFaQXL7K3YNrr0zQ==
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

    //format the payload
    const payload = {
        "iat": parseInt( current.getTime() / 1000 ),
        "iss": clientID,
        "aud": aud,
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