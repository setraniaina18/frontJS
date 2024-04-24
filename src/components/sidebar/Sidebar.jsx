import React from 'react';
import './Sidebar.css';
import DashboardSharpIcon from '@mui/icons-material/DashboardSharp';
import PeopleSharpIcon from '@mui/icons-material/PeopleSharp';
import AvTimerSharpIcon from '@mui/icons-material/AvTimerSharp';
import EditCalendarSharpIcon from '@mui/icons-material/EditCalendarSharp';
import BarChartSharpIcon from '@mui/icons-material/BarChartSharp';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { NavLink, useNavigate } from 'react-router-dom';


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
        }, 300);
    }

    


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

                <a to="/" className="a" onClick={() => { deconnexion() }}>
                    <span><ExitToAppRoundedIcon /></span>
                    <h3>Déconnexion</h3>
                </a>
            </div>
        </aside>
    )

}