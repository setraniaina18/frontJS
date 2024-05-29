import './Pointages.css';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button, IconButton } from '@mui/material';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import Brightness7RoundedIcon from '@mui/icons-material/Brightness7Rounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { Succes } from '../../components/succes/Succes';
import { Erreur } from '../../components/erreur/Erreur';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


export function Pointages() {
    useEffect(() => {
        document.title = 'pointages';

        recupHeure();

        recupPointages();

    }, []);


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


    const [cin, setCin] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    var scanner = null;

    function openScan() {
        scanner = new Html5QrcodeScanner('ecran', {
            qrbox: {
                width: 220,
                height: 220,
            },
            fps: 5,
        })

        scanner.render(success, error);

        function success(result) {
            scanner.clear();
            setCin(result);
            recupEmpScan(result);
            setIsOpen(false);
        }
        function error(err) {
            console.warn(err);
        }
    }


    const [listePoinatages, setListePointages] = useState([]);

    const recupPointages = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/pointages')
            setListePointages(res.data)
        } catch (error) {
            setIsErreurP(true);
            console.log(error)
        }
    }






    const [heurePointage, setHeurePointage] = useState([])

    const recupHeure = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/parametrePointage')
            setHeurePointage(res.data[0])
        } catch (error) {
            setIsErreurP(true);
            console.log(error)
        }
    }
    useEffect(() => {
        recupHeure();
    });


    const [confPointage, setConfPointage] = useState(false);



    const [isSuccesP, setIsSuccesP] = useState(false);
    const [isErreurP, setIsErreurP] = useState(false);


    const [pointages, setPointages] = useState({
        nom_p: "",
        prenom_p: "",
        cin_p: "",
        heure_p: dayjs().format('HH:mm'),
        date_p: dayjs().format('DD-MM-YYYY')
    })






    const recupEmpScan = async (cin) => {
        try {
            const response = await axios.get(`http://localhost:3723/api/recup/employesAvec/${cin}`);
            if (response.data.length > 0) {
                setPointages({
                    nom_p: response.data[0].nom,
                    prenom_p: response.data[0].prenom,
                    cin_p: response.data[0].cin,
                    heure_p: dayjs().format('HH:mm'),
                    date_p: dayjs().format('DD-MM-YYYY')
                })
                setConfPointage(true);
            } else {
                setIsErreurP(true);
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
        } catch (error) {
            setIsErreurP(true);
            console.error('Erreur lors de la récupération des données :', error);
        }
    };

    const ajoutPointages = async () => {
        try {
            console.log(pointages);

            await axios.post('http://localhost:3723/api/ajout/pointages', pointages);

            console.log('Pointages added successfully');

            recupPointages();
            setIsSuccesP(true);

        } catch (error) {
            setIsErreurP(true);
            console.error('Error adding pontages', error);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setIsErreurP(false);
            setIsErreurP(false);
        }, 4000);
    }, [isSuccesP, isErreurP])

    const [matin, setMatin] = useState(false);

    const [heureMatin, setHeureMatin] = useState({
        heure_mat_deb: '',
        heure_mat_fin: ''
    });

    function modifieHeureMat() {
        try {
            axios.put('http://localhost:3723/api/modification/heure_matin', heureMatin)
                .then(response => {
                    setIsSuccesP(true);
                    console.log("Heure mis à jour avec succès");
                })
                .catch(error => {
                    setIsErreurP(true);
                    console.error("Erreur lors de la mise à jour de l'heure :", error);
                });
        } catch (error) {
            setIsErreurP(true);
            console.error('Error deleting data:', error);
        }
    };


    const [apresMidi, setApresMidi] = useState(false);

    const [heureApresMidi, setHeureApresMidi] = useState({
        heure_aprem_deb: '',
        heure_aprem_fin: ''
    });

    function modifieHeureAprem() {
        try {
            axios.put('http://localhost:3723/api/modification/heure_apres_midi', heureApresMidi)
                .then(response => {
                    setIsSuccesP(true);
                    console.log("Heure mis à jour avec succès");
                })
                .catch(error => {
                    setIsErreurP(true);
                    console.error("Erreur lors de la mise à jour de l'heure :", error);
                });
        } catch (error) {
            setIsErreurP(true);
            console.error('Error deleting data:', error);
        }
    };




    return (
        <motion.div
            className="pointagePannel"

            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >



            {isSuccesP &&
                <Succes />

            }

            {isErreurP &&
                <Erreur />

            }


            {matin &&
                <motion.div className="heureP"

                    initial={{ y: -400, x: -180, opacity: 0 }}
                    animate={{ y: -100, opacity: 1 }}

                >
                    <IconButton className='closeA' aria-label="modification" size="large" onClick={() => { setMatin(false) }}>
                        <CloseIcon />
                    </IconButton>


                    <h3>Modification.</h3>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            name='heure_mat_deb'
                            label="Début"
                            format="HH:mm"
                            defaultValue={dayjs('2024-04-02T' + heurePointage.heure_mat_deb)}
                            onChange={(heureD) => setHeureMatin(prevC => ({ ...prevC, heure_mat_deb: dayjs(heureD).format('HH:mm') }))}

                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            name='heure_mat_fin'
                            label="Fin"
                            format="HH:mm"
                            defaultValue={dayjs('2024-04-02T' + heurePointage.heure_mat_fin)}
                            onChange={(heureF) => setHeureMatin(prevC => ({ ...prevC, heure_mat_fin: dayjs(heureF).format('HH:mm') }))}

                        />
                    </LocalizationProvider>


                    <div>
                        <Button
                            variant="outlined"
                            size="large"
                            color='primary'
                            onClick={() => { modifieHeureMat() }}
                        >
                            Modifier
                        </Button>
                    </div>
                </motion.div>
            }


            {apresMidi &&
                <motion.div className="heureP"

                    initial={{ y: -400, x: -180, opacity: 0 }}
                    animate={{ y: -100, opacity: 1 }}

                >
                    <IconButton className='closeA' aria-label="modification" size="large" onClick={() => { setApresMidi(false) }}>
                        <CloseIcon />
                    </IconButton>


                    <h3>Modification.</h3>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            name='heure_aprem_deb'
                            label="Début"
                            format="HH:mm"
                            defaultValue={dayjs('2024-04-02T' + heurePointage.heure_aprem_deb)}
                            onChange={(heureD) => setHeureApresMidi(prevC => ({ ...prevC, heure_aprem_deb: dayjs(heureD).format('HH:mm') }))}

                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                            name='heure_aprem_fin'
                            label="Fin"
                            format="HH:mm"
                            defaultValue={dayjs('2024-04-02T' + heurePointage.heure_aprem_fin)}
                            onChange={(heureF) => setHeureApresMidi(prevC => ({ ...prevC, heure_aprem_fin: dayjs(heureF).format('HH:mm') }))}

                        />
                    </LocalizationProvider>


                    <div>
                        <Button
                            variant="outlined"
                            size="large"
                            color='primary'
                            onClick={() => { modifieHeureAprem() }}
                        >
                            Modifier
                        </Button>
                    </div>
                </motion.div>
            }


            {confPointage &&
                <motion.div className="alert modPhoto"

                    initial={{ y: -400, x: -180, opacity: 0 }}
                    animate={{ y: -100, opacity: 1 }}

                >

                    <IconButton className='closeA' aria-label="modificatio" size="large" onClick={() => { setConfPointage(false), location.reload(); }}>
                        <CloseIcon />
                    </IconButton>


                    <h3>Confirmation.</h3>
                    <p className='confPoint'>Veuillez confirmer la pointage.</p>
                    <div>
                        <Button
                            variant="outlined"
                            size="small"
                            color='primary'
                            onClick={() => {
                                ajoutPointages();
                                setConfPointage(false);
                                location.reload();
                            }}
                        >
                            confirmer
                        </Button>
                    </div>
                </motion.div>
            }
            <div className="scannerPannel">
                <div className='view'>
                    {!cin &&
                        <div className="ecran" id='ecran'>

                        </div>
                    }

                    {!isOpen &&
                        <Button
                            variant="contained"
                            size="medium"
                            color='primary'
                            onClick={() => {
                                setIsOpen(true), openScan()
                            }}
                            className='scanBtn'
                        >
                            Scanner
                        </Button>
                    }
                </div>

                <div className='infoScan'>
                    <div className="headerH">
                        <h2>Heure de pointages</h2>
                        <NotificationsNoneRoundedIcon fontSize='large' />
                    </div>

                    <div className="heure">
                        <div className="iconH">
                            <LightModeRoundedIcon />
                        </div>
                        <div className="contentH"
                            onClick={() => {
                                setMatin(true),
                                    setHeureMatin({ heure_mat_deb: heurePointage.heure_mat_deb, heure_mat_fin: heurePointage.heure_mat_fin })
                            }}
                        >
                            <div className="infoH">
                                <h3>Matin</h3>
                                <small className="text_muted">
                                    {heurePointage.heure_mat_deb}  - {heurePointage.heure_mat_fin}
                                </small>
                            </div>
                            <MoreVertRoundedIcon />
                        </div>
                    </div>


                    <div className="heure">
                        <div className="iconH desactiveH">
                            <Brightness7RoundedIcon />
                        </div>
                        <div className="contentH"
                            onClick={() => {
                                setApresMidi(true),
                                    setHeureApresMidi({ heure_aprem_deb: heurePointage.heure_aprem_deb, heure_aprem_fin: heurePointage.heure_aprem_fin })
                            }}
                        >
                            <div className="infoH">
                                <h3>Après midi </h3>
                                <small className="text_muted">
                                    {heurePointage.heure_aprem_deb}  - {heurePointage.heure_aprem_fin}
                                </small>
                            </div>
                            <MoreVertRoundedIcon />
                        </div>
                    </div>

                </div>
            </div>

            <div className="listePointages">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>CIN</th>
                            <th>Heure</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            listePoinatages.map((pt) => (
                                <motion.tr key={pt.idP}>
                                    <td>{pt.nom_p}</td>
                                    <td>{pt.prenom_p}</td>
                                    <td>{pt.cin_p}</td>
                                    <td>{pt.heure_p}</td>
                                    <td>{pt.date_p}</td>
                                </motion.tr>
                            ))}

                    </tbody>
                </table>

            </div>
        </motion.div>
    )
}