import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const bulkSignDocuments = async (req, res) => {
    const {
      email_address,
      role,
      access_token
    } = req.body;

    let correlationId = uuidv4();

    let data

    res.status( 200 ).json( {
      data: req.body,
      accessToken: accessToken
    } );
};
