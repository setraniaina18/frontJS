import './Statistique.css';

import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Statistique() {
    useEffect(() => {
        document.title = 'statistique'
    }), [];


    const navigate = useNavigate();

    function isConnecte() {
        const userConnecte = sessionStorage.getItem('connecte');
        if (!userConnecte || userConnecte !== 'true') {
            navigate('/login');
        }
    }
    useEffect(() => {
        isConnecte();
    })


    const [totalEmp, setTotalEmp] = useState(null)
    const [totalEmpTravail, setTotalEmpTravail] = useState(null)
    const [totalEmpConge, setTotalEmpConge] = useState(null)
    const [totalEmpHommes, setTotalEmpHommes] = useState(null)
    const [totalEmpFemmes, setTotalEmpFemmes] = useState(null)


    const total = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/effectifEmp')
            setTotalEmp(res.data[0].total)
            console.log(res.data[0].total)
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
    const totalHommes = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/hommes')
            setTotalEmpHommes(res.data[0].total)
        } catch (error) {
            console.log(error)
        }
    }

    const totalFemmes = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/femmes')
            setTotalEmpFemmes(res.data[0].total)
        } catch (error) {
            console.log(error)
        }
    }



    
    
    
    
    useEffect(() => {
        total();
        totalTravail();
        totalConge()
        totalHommes();
        totalFemmes();
    }, []);


    return (
        <motion.div className="stat"

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="piechart">
                <div>
                    <PieChart

                        series={[
                            {
                                data: [
                                    { id: 0, value: totalEmpTravail, label: 'En travail', color: '#1B9C85' },
                                    { id: 1, value: totalEmpConge, label: 'En congé', color: '#D94452' },
                                ],
                                innerRadius: 45,
                                outerRadius: 100,
                                paddingAngle: 2,
                                cornerRadius: 7,
                                cx: 130,
                                cy: 200
                            },
                        ]}
                        width={400}
                        height={400}
                    />
                </div>
                <div>


                    <PieChart
                        series={[
                            {
                                data: [
                                    { id: 0, value: totalEmpFemmes, label: 'Femmes', color: '#1B9C85' },
                                    { id: 1, value: totalEmpHommes, label: 'Hommes', color: '#4B84DA' }
                                ],
                                highlightScope: { faded: 'global', highlighted: 'item' },
                                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                            },
                        ]}
                        height={200}
                    />
                </div>
            </div>
            <div className="barchart">
                <BarChart
                    xAxis={[{ scaleType: 'band', data: ['Effectifs', 'group B', 'group C', 'group D'] }]}
                    series={[{ data: [totalEmpTravail, 3, 5, 2], color: '#1B9C85' }, { data: [totalEmp, 8, 9, 6], color: '#4B89DA' }, { data: [totalEmpConge, 5, 4, 4], color: '#D94452' }]}
                    width={1000}
                    height={300}
                />

            </div>
        </motion.div>
    )
}