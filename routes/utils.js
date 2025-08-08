import jwt from 'jsonwebtoken'
import fs from 'fs'
import Axios from 'axios'
import multer from "multer"

let privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDpdR8sk/3wSuFG
blZ9pNaNHnHpf+OQHqne2KuhkvbBqqcTebW9wyz6drzPwvI9y24jOsIlE70l1kOx
pdqFxWRSbHDKStUZazCVo2R4Q9KtxCPqlasUDLhd906cd8iy9qDblrho0aqgzp7+
24rCLYt+0L/r4Wcy+HsXx0fLAQrUwdGj/k3DJYR352eKyduGpb29ZodoMeB1WvFZ
6TEb9aTSOuiug6ZH8MAu+3cfKZT5gMvbwlA9CNwEjitlXkGlyB3WKutdiPPFzOOi
6rltjBUxSREh3Q20do9rIIKb82cVsATKzyWxN/e1K1YIGc1kdGA158mhSCXOR78+
lBkbsa8pAgMBAAECggEBANbXYNvuSXgUAOKG8fNoecWeaegfODVN8rfQn4nurESn
nl/O1tCOR9sq4DE2TyVNC8tB7J6gXqXuW5elcMdAU0WC4/1WBmwA99INbo06pSwi
X4cnOywVVKmsyFw346vGSVwrhQN5R9P6sdkKAtUVgtUumCAj64u9ndHRI6GPEP+e
p+JVhe1MyckCc0Ew6cNqSdIdnE1yWtA6LsWKhI483/srytwK2ebn4CZuju1Fs/zF
GYs0hIAr2EjE/sL6W1lr4frUjI9vx+rTOcAqNEINRvesaUsZ/Uq/WpC7Py3eMHLl
IbR9cq3ziaR9r9/LIpp+tu/B4FN5sGE8Q1jR9Wi+HV0CgYEA/adZ6/BCOnDB0z6A
jMs7Y0srXE1H7JrQ3d+3SY5R6oBhBZwXgFd/txLmmiQ2sj3CoqcwcJTag7vgDVKq
jraiXVzdlISxJrYB7SmWLrpJmxMsSPeDUw5OQGA4v4jNhDqE/iyV76P0pnNaWUgG
AYvExk7FsyKTCgteRH449k6CO8sCgYEA653yNyclSgMFHW6R3sttFOVKGFftmynF
Mh7obuU9N90u5zyXFmRdQmt7wsdW5tCSLj8o9aMchy9SQrrnoHZbJeWnRx3Kt6uV
i6R+ky4TqIVAfyRsevjBgpf8bf6GndIOelm32rAc5GX2aB8OUJH37a6blSMlTdYE
zvTqmJ4hilsCgYBaPfPL8Qpe6EbM9OufK57RUKj4ibYRA3NTvIfk73FNUKcz67ig
vIB/jYXlSQT8nORmIb0mEI89VtX7Z3GunGNfe+6JLDwqXY6J5cW8kiIlvch/nS9n
mStV0+XcnrsfVAKEuzAMtfQQU/HM2cbpPeSf+N51QNO3Oxwqmg2B86R5yQKBgQCu
rq8BDNisgoisRWmIUDFTKJtCaQ4T12gHvLp+XR6B6E35ygYJ5+bsc1uSEM/w1/lI
qDLpykBASWknaAKKCLWS5yyZoRDGE0QP/6iH3cVdT0199bcnhH2TILNZqTaMk0uA
kjuouqDxBFcm4r9uJIo3gRh//UqO5nkyJoo3FCWxuQKBgQDXyGE/gtEd3sDKg0W3
Z2tkt1Bgmc7y3fJaaNemHnJHAH3p3T/Y6PmX5U6vZ9xbX541lGG6fNjcOoL6BtyP
LRsMTfOiB1uLv1j9ieW8zZH1TDKKCyQr+CnghUuk+TWd6jGi5QSwz6XpZgsj8fLe
8PvWcXCU9xlRHvNxVPeS6LU7ug==
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