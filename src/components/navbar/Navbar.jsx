import React, { useEffect, useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import axios from 'axios';



export function Navbar() {


    const [listeAdmin, setListeAdmin] = useState([]);


    const recupAdmin = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/login')
            setListeAdmin(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        recupAdmin()
    }, [])
    return (

        <div className="right-section">
            <div className="nav">
                <button id="menu-btn">
                    <MenuRoundedIcon fontSize='large' />
                </button>

                <div className="dark-mode">
                    <span className="material-icons-sharp active">

                    </span>
                    <span className="material-icons-sharp">

                    </span>
                </div>

                <div className="profile">
                    <div className="info">
                        <p><b>{ listeAdmin.map((e) => e.mail) }</b></p>
                        <small className="text-muted">Admin</small>
                    </div>
                    <div className="profile-photo">
                        <img src="./DRI.png" />
                    </div>
                </div>

            </div>
        </div>
    )
}