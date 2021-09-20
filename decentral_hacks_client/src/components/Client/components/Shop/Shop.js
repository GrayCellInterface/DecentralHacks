import axios from 'axios';
import React, { useEffect, useState } from 'react';
import encrypt from '../../../../assets/js/encryptPGP';
import { iso31661 } from 'iso-3166'

//Gray Cell Interface API : QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==

const Shop = () => {

    const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
            "Bearer QVBJX0tFWToyYjNlZDk2ZTg3NDM4MzRkYTM0YmY1NmEzZjA5YjdiZTozM2VmNWE2ZDM1MmFjYzQ1ZjNiMGM3OWJkN2ZhOTAwNQ==",
    };


    const [cardDetails, setCardDetails] = useState({
        number: '4007400000000007',
        cvv: '123'
    })

    const [publicKey, setPublicKey] = useState("")
    const [keyId, setKeyId] = useState("")
    const [encryptedData, setEncryptedData] = useState("")

    useEffect(() => {

        const getPublicKey = async () => {

            const url = 'https://api-sandbox.circle.com/v1/encryption/public'

            await axios.get(url, { headers }).then((res) => {
                setPublicKey(res.data.data)
                console.log(res.data.data)
            }).catch((err) => {
                console.log(err)
            })
        }

        getPublicKey();
        console.log(iso31661)

    }, [])



    const encryptCardData = async () => {

        const encryptedData = await encrypt(cardDetails, publicKey)
        const { encryptedMessage, keyId } = encryptedData

        setEncryptedData(encryptedMessage)
        setKeyId(keyId)

        console.log(encryptedMessage)
        console.log(encryptedData)

    }

    const getCard = async () => {
        console.log(typeof (encryptedData))

        const body = {
            idempotencyKey: "ba943ff1-ca17-49b2-ba55-1057e70ca5c7", //uuidv4(),
            keyId: keyId,
            encryptedData: encryptedData,
            billingDetails: {
                name: "Satoshi Nakamoto",
                city: "Mumbai",
                country: "IN",
                line1: "Address 1",
                line2: "Address 2",
                district: "MA",
                postalCode: "400053",
            },
            expMonth: 11,
            expYear: 2022,
            metadata: {
                email: "satoshi@circle.com",
                phone: "9167079283",
                sessionId: 'xxx',
                ipAddress: '127.0.0.1'
            }
        };
        await axios
            .post("https://api-sandbox.circle.com/v1/cards", body, { headers })
            .then((response) => console.log(response.data.data.id)).catch((error) => console.log(error.response.data));
    }



    return (
        <>
            <div>
                The Shop Will Be Here
            </div>
            <button onClick={encryptCardData}>Encrypt Card Data</button>
            <button onClick={getCard}>Get Card</button>
        </>
    );
}

export default Shop;