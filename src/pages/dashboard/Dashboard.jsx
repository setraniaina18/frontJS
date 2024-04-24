import './Dashboard.css';
import React, { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendrier from '../../components/calendrier/Calendrier';

export function Dashboard() {
    useEffect(() => {
        document.title = 'tableau de bord';
    }, []);

    function tab() {
        var c = parseInt(-(360 - ((totalEmpConge * 100 / totalEmp) * 3.6)) * 0.588 - 13);
        console.log('c = ', c)
        var conge = document.querySelectorAll("main .analyse .emp-conge svg circle")[0];
        let k = -225;
        if (c) {
            const cong = setInterval(() => {
                conge.style.strokeDashoffset = k;
                k++;
                if (k == c) {
                    clearInterval(cong);
                }
            }, 1500 / (224 + c));
        }

        var t = parseInt(-(360 - ((totalEmpTravail * 100 / totalEmp) * 3.6)) * 0.588 - 13);
        console.log('t = ', t)
        var trav = document.querySelectorAll("main .analyse .emp-trav svg circle")[0];
        let j = -225;
        if (t) {
            const tra = setInterval(() => {
                trav.style.strokeDashoffset = j;
                j++;
                if (j == t) {
                    clearInterval(tra);
                }
            }, 1500 / (224 + t));
            console.log(2000 / (224 + t))
        }

        var total = document.querySelectorAll("main .analyse .sales svg circle")[0];
        let i = -224;
        const val = setInterval(() => {
            total.style.strokeDashoffset = i;
            i++;
            if (i == -13) {
                clearInterval(val);
            }
        }, 7.1);
    };




    const navigate = useNavigate();

    function isConnecte() {
        const userConnecte = sessionStorage.getItem('connecte');
        if (!userConnecte || userConnecte !== 'true') {
            navigate('/login');
        }
    }

    useEffect(() => {
        isConnecte();
        if (totalEmpConge && totalEmpTravail) {
            tab();
        }
    })


    const [totalEmp, setTotalEmp] = useState(null)
    const [totalEmpTravail, setTotalEmpTravail] = useState(null)
    const [totalEmpConge, setTotalEmpConge] = useState(null)



    const total = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/effectifEmp')
            setTotalEmp(res.data[0].total)
        } catch (error) {
            console.log(error)
        }
    }

    const totalTravail = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/effectifEmpTravail')
            setTotalEmpTravail(res.data[0].total)
        } catch (error) {
            console.log(error)
        }
    }

    const totalConge = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/effectifEmpConge')
            setTotalEmpConge(res.data[0].total)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        total();
        totalTravail();
        totalConge();
    });

    return (
        <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}

        >
            <main>
                <h1>Tableau de bord</h1>
                <div className="analyse">
                    <div className="sales">
                        <div className="status">
                            <div className="info">
                                <h3>Total des employés</h3>
                                <h1>{totalEmp}</h1>
                            </div>
                            <div className="progresss">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div className="percentage">
                                    <p>100%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="emp-trav">
                        <div className="status">
                            <div className="info">
                                <h3>En travail</h3>
                                <h1>{totalEmpTravail}</h1>
                            </div>
                            <div className="progresss">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div className="percentage">
                                    <p>{(totalEmpTravail * 100 / totalEmp).toPrecision(3)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="emp-conge">
                        <div className="status">
                            <div className="info">
                                <h3>En congés</h3>
                                <h1>{totalEmpConge}</h1>
                            </div>
                            <div className="progresss">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div className="percentage">
                                    <p>{(totalEmpConge * 100 / totalEmp).toPrecision(3)}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <div className='basdash'>
                <div className='calendar'>
                    <Calendrier className='calendar1' />
                </div>
                <div className="pointages">

                </div>
            </div>
        </motion.div>
    )
}