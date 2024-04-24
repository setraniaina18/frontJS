import './Conges.css';
import { Box, Button, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material';

import React, { useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { motion } from 'framer-motion'
import { QRCode } from 'react-qr-code';
import { Succes } from '../../components/succes/Succes';
import axios from 'axios';
import dayjs from 'dayjs';
import { Erreur } from '../../components/erreur/Erreur';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';

export function Conges() {

    useEffect(() => {
        document.title = 'congés'
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



    const [isSuccesCong, setIsSuccesCong] = useState(false);
    const [isErreurCong, setIsErreurCong] = useState(false);
    const [ListConges, setListConges] = useState([]);
    const [donneeCibleConge, setDonneeCibleConge] = useState({});
    const [donneeCibleEmpConge, setDonneeCibleEmpConge] = useState({});

    const [afficheCongeDetail, setAfficheCongeDetail] = useState(false);

    const [conge, setConge] = useState({
        cin_emp_cong: "",
        poste_emp_cong: "",
        type_cong: "",
        motif_cong: "",
        nbr_max: "",
        date_debut: dayjs(),
        nbr: 1,
        date_fin: dayjs().add(1, 'day').format('DD-MM-YYYY')
    })

    const qrCodeOptions = {
        backgroundColor: '#ffffff',
        color: '#000000',
        level: 'Q', //(L, M, Q, H)
    };



    const ajoutCong = async () => {

        console.log(conge);
        try {
            const date_deb = dayjs(conge.date_debut).format('DD-MM-YYYY');
            const donnees_c = { ...conge, date_debut: date_deb };
            const donnees_c1 = { ...donnees_c, cin_emp_cong: cinEmp };
            const donnees_cf = { ...donnees_c1, poste_emp_cong: posteEmp };

            await axios.post('http://localhost:3723/api/ajout/conges', donnees_cf);

            console.log('Conges added successfully');
            modifieEmpConge(cinEmp);
            setConge({
                cin_emp_cong: "",
                poste_emp_cong: "",
                type_cong: "",
                motif_cong: "",
                nbr_max: "",
                date_debut: "",
                nbr: "",
                date_fin: ""
            });
            recupConges();
            localStorage.removeItem('cinEmp');
            localStorage.removeItem('posteEmp');

        } catch (error) {
            console.error('Error adding employee', error);
        }
    }

    const [empPrendCong, setEmpPrendCong] = useState({
        date_debut: "",
        nbr: "",
        date_fin: ""
    })


    const modifieEmpConge = (cin) => {
        const date_deb = dayjs(conge.date_debut).format('DD-MM-YYYY');
        const donnees_c = { ...empPrendCong, date_debut: date_deb };
        const donnees_c1 = { ...donnees_c, nbr: conge.nbr };
        const donnees_cf = { ...donnees_c1, date_fin: conge.date_fin };
        try {
            axios.put(`http://localhost:3723/api/modification/employesConge/${cin}`, donnees_cf)
                .then(response => {
                    setIsSuccesCong(true);
                    modifieEmpDebConge(date_deb);
                    console.log("Employé mis à jour avec succès");
                })
                .catch(error => {
                    setIsErreurCong(true);
                    console.error("Erreur lors de la mise à jour de l'employé :", error);
                });
        } catch (error) {
            setIsErreurCong(true);
            console.error('Error deleting data:', error);
        }
    };

    //Modification emp en congé
    const modifieEmpDebConge = () => {
        const date_deb = dayjs().format('DD-MM-YYYY');
        console.log(date_deb);
        try {
            axios.put(`http://localhost:3723/api/modification/employesDebConge/${date_deb}`)
                .then(response => {
                    recupEmp();
                    console.log("Employé mis à jour avec succès");
                })
                .catch(error => {
                    setErreurAEmp(true);
                    console.error("Erreur lors de la mise à jour de l'employé :", error);
                });
        } catch (error) {
            setErreurAEmp(true);
            console.error('Error deleting data:', error);
        }
    };



    const modifieEmpTrav = (cin) => {
        try {
            axios.put(`http://localhost:3723/api/modification/employesTrav/${cin}`)
                .then(response => {
                    suppressionEmp(cinEmp);
                    setIsSuccesCong(true);
                    setPrendre(false);
                    recupEmp();
                    console.log("Employé mis à jour avec succès");
                })
                .catch(error => {
                    console.error("Erreur lors de la mise à jour de l'employé :", error);
                });
        } catch (error) {
            setIsErreurCong(true);
            console.error('Error deleting data:', error);
        }
    };

    //Suppression conges
    const suppressionEmp = async (cin) => {
        try {
            await axios.delete(`http://localhost:3723/api/suppression/conges/${cin}`);
        } catch (error) {
            setErreurAEmp(true);
            console.error('Error deleting data:', error);
        }
    };






    const recupConges = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/conges')
            setListConges(res.data)
        } catch (error) {
            setIsErreurCong(true);
            console.log(error)
        }
    }

    // useEffect(() => {
    //     recupConges(donneeCibleConge.cin_emp_cong);
    // }, [donneeCibleConge.cin_emp_cong]);

    useEffect(() => {
        recupConges();
    }, []);


    const selectEmpCong = async (cin) => {
        try {
            const res = await axios.get(`http://localhost:3723/api/recup/employesAvec/${cin}`);

            setDonneeCibleEmpConge(res.data[0])
            console.log(res.data[0]);

        } catch (error) {
            setIsErreurCong(true);
            console.log(error)
        }
    };




    const [cinEmp, setCinEmp] = useState('')
    const [posteEmp, setPosteEmp] = useState('')

    function recupEmp() {
        setCinEmp(localStorage.getItem('cinEmp'))
        setPosteEmp(localStorage.getItem('posteEmp'))
    }
    useEffect(() => {
        recupEmp();
    }, [])


    const [prendre, setPrendre] = useState(false);





    function recCong(e) {
        setConge((co) => ({ ...co, [e.target.name]: e.target.value }))
    }

    const recCongDate = (e) => {
        const { name, value } = e.target;
        setConge(prevConge => ({ ...prevConge, [name]: value }));

        if (name === 'date_debut' || name === 'nbr') {
            if (conge.date_debut && conge.nbr) {
                const dateFin = dayjs(conge.date_debut, 'DD-MM-YYYY').add(conge.nbr, 'day').format('DD-MM-YYYY');
                setConge(prevConge => ({ ...prevConge, date_fin: dateFin }));
            }
        }
    };

    const recValCong = (event) => {
        const { name, value } = event.target;
        let nbrMaxValue;
        switch (value) {
            case 'Congé annuel':
                nbrMaxValue = '30';
                break;
            case 'Congé de maladie':
                nbrMaxValue = '10';
                break;
            case 'Congé de formation':
                nbrMaxValue = '15';
                break;
            case 'Congé de maternité':
                nbrMaxValue = '90';
                break;
            case 'Congé de paternité':
                nbrMaxValue = '14';
                break;
            default:
                nbrMaxValue = '';
                break;
        }

        setConge(prevData => ({ ...prevData, [name]: value, nbr_max: nbrMaxValue }));
    };

    function effaceChamps() {
        localStorage.removeItem('cinEmp');
        localStorage.removeItem('posteEmp');
        location.reload();
    }

    useEffect(() => {
        setTimeout(() => {
            setIsErreurCong(false);
            setIsErreurCong(false);
        }, 4000);
    }, [isSuccesCong, isErreurCong])




    const [sendmail, setSendmail] = useState(false);
    const [mail, setMail] = useState({
        a: '',
        objet: '',
        message: ''
    })
    const rec_mail = (e) => {
        setMail({
            ...mail,
            [e.target.name]: e.target.value
        });
    };

    function envoyer_mail() {
        console.log(mail);
        try {
            axios.post('http://localhost:3723/api/envoyer_mail', mail);

            setMail({
                a: '',
                objet: '',
                message: ''
            });
            setTimeout(() => {
                setIsSuccesCong(true);
                setTimeout(() => {
                    setSendmail(false);
                }, 1000);
            }, 500);

        } catch (error) {
            setIsErreurCong(true);
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        }
    };

    return (
        <motion.div className="conge"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >

            {isSuccesCong &&
                <Succes />

            }

            {isErreurCong &&
                <Erreur />

            }



            <div className="ajoutC">
                <div className='dmd'>
                    <h2>Demande de congés</h2>
                </div>
                <Box
                    className="ajoutC1"
                    component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '25rem' },
                    }}
                    noValidate
                    autoComplete="off"
                >

                    <TextField value={cinEmp ? cinEmp : ""} name='cin_emp_cong' className='inputF' id="standard-basic" label="CIN" variant="standard" />
                    <TextField value={posteEmp ? posteEmp : ""} name='poste_emp_cong' className='inputF' id="standard-basic" label="Poste" variant="standard" />

                    <div>
                        <InputLabel id="typeC">Type de congé</InputLabel>
                        <Select
                            name='type_cong'
                            className='select inputF'
                            labelId="typeC"
                            value={conge.type_cong}

                            onChange={recValCong}

                            label="Type de congé"
                            variant="standard"
                            MenuProps={{ classes: { paper: 'popup', listItem: 'popup' } }}
                        >

                            <MenuItem value="Congé annuel">Congé annuel</MenuItem>
                            <MenuItem value="Congé de maladie">Congé de maladie</MenuItem>
                            <MenuItem value="Congé de formation">Congé de formation</MenuItem>
                            <MenuItem value="Congé de maternité">Congé de maternité</MenuItem>
                            <MenuItem value="Congé de paternité">Congé de paternité</MenuItem>

                        </Select>
                    </div>

                    <TextField onChange={recCong} name='motif_cong' className='inputF' id="standard-basic" label="Motifs" variant="standard" />
                    <TextField value={conge.nbr_max} onChange={recValCong} name='nbr_max' className='inputF' id="standard-basic" label="Jours maximal" variant="standard" />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            name="date_debut"
                            value={conge.date_debut}
                            onChange={(dateD) => setConge(prevC => ({ ...prevC, date_debut: dateD }))}
                            label="Date du début"
                            className='inputF'
                            format="DD-MM-YYYY"
                            minDate={dayjs()}

                            slotProps={{
                                textField: { variant: 'standard' },
                            }}
                        />
                    </LocalizationProvider>

                    <TextField value={conge.nbr} onChange={recCongDate} name='nbr' className='inputF' id="standard-basic" label="Nombre du jours" variant="standard" type="number" InputProps={{ inputProps: { min: 1, max: 30 } }} />
                    <TextField value={conge.date_fin} onChange={recCong} name='date_fin' className='inputF' id="standard-basic" label="Date fin" variant="standard" />
                </Box>
                {cinEmp && posteEmp &&
                    <div className='btn'>

                        <Button
                            variant="contained"
                            size="medium"
                            className='btnA'
                            onClick={ajoutCong}
                        >
                            Valider
                        </Button>


                        <Button
                            className='btnB'
                            variant="contained"
                            size="medium"
                            color="error"
                            onClick={() => { effaceChamps() }}
                        >
                            Annuler
                        </Button>

                    </div>
                }
            </div>
            <div className="listeC">
                <table>
                    <thead>
                        <tr>
                            <th>CIN</th>
                            <th>Poste</th>
                            <th>Date début</th>
                            <th>Date fin</th>
                        </tr>
                    </thead>

                    <tbody>
                        {ListConges.map((con) => (
                            <motion.tr key={con.id_conge}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    setDonneeCibleConge(con),
                                        selectEmpCong(con.cin_emp_cong),
                                        setCinEmp(con.cin_emp_cong),
                                        setAfficheCongeDetail(true)
                                }}
                            >
                                <td>{con.cin_emp_cong}</td>
                                <td>{con.poste}</td>
                                <td>{con.date_debut}</td>
                                <td>{con.date_fin}</td>
                            </motion.tr>
                        ))}

                    </tbody>
                </table>

            </div>












            {/* Information et modification  conges */}
            {prendre &&
                <motion.div className="alert"
                    initial={{ y: -400, x: -180, opacity: 0 }}
                    animate={{ y: -100, opacity: 1 }}

                >
                    <IconButton className='closeA' aria-label="delete" size="large" onClick={() => { setPrendre(false) }}>
                        <CloseIcon />
                    </IconButton>


                    <h3>Confirmation.</h3>
                    <p>L'employé a terminé ses congés ?</p>

                    <Button
                        className='btnSucceA'
                        variant="outlined"
                        size="small"
                        onClick={() => { modifieEmpTrav(cinEmp); }}

                    >
                        Ok
                    </Button>
                </motion.div>
            }

            {afficheCongeDetail &&

                <div className="emp1">
                    {sendmail &&
                        <motion.div className="sendMail"

                            initial={{ y: -400, x: -180, opacity: 0 }}
                            animate={{ y: -100, opacity: 1 }}

                        >
                            <IconButton className='closeA' aria-label="modificatio" size="large" onClick={() => { setSendmail(false) }}>
                                <CloseIcon />
                            </IconButton>
                            <h3>Envoyer un e-mail.</h3>
                            <div>
                                <p>De :  driantsirabe@gmail.com</p>
                                <p>A :   {donneeCibleEmpConge.mail}</p>
                                <Input
                                    className='inputMail'
                                    placeholder="Objet"
                                    sx={{
                                        '&::before': {
                                            display: 'none',
                                        },
                                        '&:focus-within': {
                                            outline: 'none',
                                        },
                                    }}

                                    name='objet'
                                    onChange={rec_mail}
                                />

                                <Textarea
                                    minRows={7}
                                    className='inputMail'
                                    placeholder="Votre message…"
                                    sx={{
                                        '&::before': {
                                            left: '2.5px',
                                            right: '2.5px',
                                            bottom: 0,
                                            top: 'unset',
                                            transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
                                            borderRadius: 0,
                                        },
                                        '&:focus-within::before': {
                                            transform: 'scaleX(1)',
                                        },
                                    }}
                                    name='message'
                                    onChange={rec_mail}
                                />
                                <Button
                                    size="small"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                                    color="primary"
                                    onClick={() => { envoyer_mail() }}
                                >
                                    Envoyer
                                </Button>
                            </div>

                        </motion.div>
                    }


                    <motion.div className="infEmp"
                        initial={{ y: -1250, x: -520 }}
                        animate={{ y: -380, x: -520 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className='head'>
                            <h2>Information d'un employé</h2>
                            <IconButton className='close' aria-label="delete" size="large"
                                onClick={() => {
                                    setAfficheCongeDetail(false);
                                    location.reload();
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <div className='carte'>

                            <div className="profileP">
                                <div className='profil1'>
                                    <img className='img1' src={"http://localhost:3723/images/" + donneeCibleEmpConge.photo} />
                                </div>
                            </div>

                            <div id='carteP'>
                                <div className='carte1' >
                                    <div className='qrCode'>
                                        <QRCode className='qrCode' value={donneeCibleConge.cin_emp_cong} {...qrCodeOptions} />
                                    </div>
                                    <div className='infoQR'>
                                        <p>Nom : {donneeCibleEmpConge.nom}</p>
                                        <p>Prénoms : {donneeCibleEmpConge.prenom}</p>
                                        <p>CIN : {donneeCibleEmpConge.cin}</p>
                                        <p>E-mail : {donneeCibleEmpConge.mail}</p>
                                        <p>Poste : {donneeCibleEmpConge.poste}</p>

                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className='infEmp1'>
                            <Box
                                className='left'
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1, width: '20rem' },
                                }}

                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleEmpConge.nom}
                                    className='inputF'
                                    id="nom"
                                    label="Nom"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={donneeCibleEmpConge.prenom}
                                    className='inputF'
                                    id="prenom"
                                    label="Prénoms"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleEmpConge.adresse}
                                    className='inputF'
                                    id="adresse"
                                    label="Adresse"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={donneeCibleEmpConge.cin}
                                    className='inputF'
                                    id="cin"
                                    label="CIN"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={donneeCibleEmpConge.sexe}
                                    className='inputF'
                                    id="sexe"
                                    label="Sexe"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleEmpConge.mail}
                                    className='inputF'
                                    id="mail"
                                    label="Email"
                                    variant="standard" />
                            </Box>
                            <Box
                                className='right'
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1, width: '20rem' },
                                }}
                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleEmpConge.poste}
                                    className='inputF'
                                    id="poste"
                                    label="Poste"
                                    variant="standard"
                                />

                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleConge.type_conge}
                                    className='inputF'
                                    id="standard-basic"
                                    label="Type de congés"
                                    variant="standard"
                                />

                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleConge.motif_conge}
                                    className='inputF'
                                    id="phone"
                                    label="Motif du congé"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleConge.date_debut}
                                    className='inputF'
                                    id="standard-basic"
                                    label="Date début"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleConge.date_fin}
                                    className='inputF'
                                    id="standard-basic"
                                    label="Date fin"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCibleConge.nbrjrs_conge}
                                    className='inputF'
                                    id="standard-basic"
                                    label="Durée"
                                    variant="standard"
                                />
                            </Box>
                        </div>
                        <div className='btn'>
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={()=>{setSendmail(true), setMail({a: donneeCibleEmpConge.mail})}}
                            >
                                Envoyer un e-mail
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                className='btnA'
                                onClick={() => { setPrendre(true) }}
                            >
                                Conge termine
                            </Button>
                        </div>
                    </motion.div>
                </div>
            }

        </motion.div >
    )
}