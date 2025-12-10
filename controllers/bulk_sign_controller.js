import axios from 'axios';

// Controller to handle bulk signing
export const bulkSignDocuments = async (req, res) => {
    const {
      email_address,
      correlationId,
      role,
      access_token
    } = req.body;

    let data

    if (!accessToken) {
      return res.status(401).json({ error: 'Missing UGPass Access Token' });
    }

    if( role  === "CHAIRMAN" ) {
        data =  {
            sourcePath: "",
            destinationPath: "",
            id: email_address,
            correlationId: "",
            placeHolderCoordinates: {
              pageNumber: "1",
              signatureXaxis: "50.0",
              signatureYaxis: "625.0",
            },
            esealPlaceHolderCoordinates: {
              pageNumber: "1",
              signatureXaxis: "215.0",
              signatureYaxis: "700.0"
           }
          }
    }
    else {
        data = {
            sourcePath: "",
            destinationPath: "",
            id: email_address,
            correlationId: "",
              placeHolderCoordinates: {
                pageNumber: "1",
                signatureXaxis: "400.0",
                signatureYaxis: "625.0",
              },
        }
    }

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://nita.ugpass.go.ug/ERB-Agent/api/digital/signature/bulk/sign',
        headers: { 
            'UgPassAuthorization': `Bearer ${access_token}`, 
            'Content-Type': "application/json",
            ...data.getHeaders()
        },
        data : data
    };

    axios.request(config)
    .then((response) => {
        let result = JSON.stringify(response.data);
        console.log("bulk-please", result);
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
};
