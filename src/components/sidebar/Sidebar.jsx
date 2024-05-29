import React, { useState } from 'react';
import './Sidebar.css';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import AvTimerSharpIcon from '@mui/icons-material/AvTimerSharp';
import EditCalendarSharpIcon from '@mui/icons-material/EditCalendarSharp';
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';


const nav = [
    {
        name: 'Tableau',
        path: '/dashboard',
        key: 'tableaudebord',
        icon: <DashboardSharpIcon />
    },
    {
        name: 'Employes',
        path: '/employes',
        key: 'employes',
        icon: <PeopleSharpIcon />
    },
    {
        name: 'Pointages',
        path: '/pointages',
        key: 'pointages',
        icon: <AvTimerSharpIcon />
    },
    {
        name: 'Congés',
        path: '/conges',
        key: 'conges',
        icon: <EditCalendarSharpIcon />
    },
    {
        name: 'Statistique',
        path: '/statistique',
        key: 'statistique',
        icon: <BarChartSharpIcon />
    }
]

export function Sidebar() {

    const navigate = useNavigate();

    function deconnexion() {
        sessionStorage.removeItem('connecte');
        setTimeout(() => {
            navigate('/login');
            setConfirmDeco(false);
        }, 300);
    }



    const [confirmDeco, setConfirmDeco] = useState(false);


    return (
        <aside>
            <div className="toggle">

                <div className="close" id="close-btn" >
                    <CloseRoundedIcon fontSize='large' />
                </div>
            </div>

            <div className="sidebar">
                {nav.map((item) => (
                    <NavLink to={item.path} key={item.key} className="a">
                        <span>{item.icon}</span>
                        <h3>{item.name}</h3>
                    </NavLink>
                ))}

                <a className="a" onClick={() => { setConfirmDeco(true) }}>
                    <span><ExitToAppRoundedIcon /></span>
                    <h3>Déconnexion</h3>
                </a>
            </div>

            {confirmDeco &&
                <motion.div className="alert confSupp"

                    initial={{ y: -400, x: -180, opacity: 0 }}
                    animate={{ y: -100, opacity: 1 }}
                >
                    <IconButton className='closeA' aria-label="delete" size="large" onClick={() => { setConfirmDeco(false) }}>
                        <CloseIcon />
                    </IconButton>
                    <h3>Confirmation.</h3>
                    <p>Voulez-vous vraiment déconnecter ?</p>
                    <div>
                        <Button
                            className='btnOuiSupp'
                            variant="outlined"
                            size="small"
                            color='error'
                            onClick={() => { deconnexion() }}
                        >
                            Oui, déconnecter
                        </Button>
                    </div>
                </motion.div>
            }
        </aside>
    )

}