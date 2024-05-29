import React, { useEffect, useState } from 'react';
import './Employes.css';
import { Box, Button, IconButton, InputLabel, MenuItem, Select, TextField, duration } from "@mui/material";
import axios from 'axios';
import { motion } from 'framer-motion';
import { QRCode } from 'react-qr-code';
import dayjs from 'dayjs';

import CloseIcon from '@mui/icons-material/Close';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SendIcon from '@mui/icons-material/Send';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import { Succes } from '../../components/succes/Succes';
import { Erreur } from '../../components/erreur/Erreur';
import { useNavigate } from 'react-router-dom';
import Textarea from '@mui/joy/Textarea';
import Input from '@mui/joy/Input';

export function Employes() {
    useEffect(() => {
        document.title = 'employes'
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



    const [ListEmp, setListEmP] = useState([]);
    const [afficheInfo, setAfficheInfo] = useState(false);
    const [afficheAjout, setAfficheAjout] = useState(false);
    const [modifierBtn, setModifierBtn] = useState(false);
    const [donneeCible, setDonneeCible] = useState({})
    const [succesAEmp, setSuccesAEmp] = useState(false);
    const [erreurAEmp, setErreurAEmp] = useState(false);
    const [confirmSuppEmp, setConfirmSuppEmp] = useState(false);







    const handlePrint = () => {
        const printableDiv = document.getElementById('divToPrint');
        if (printableDiv) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Liste des employés</title>
                </head>
                <body>
                    ${printableDiv.innerHTML}
                    <style>
                        .ajoutImp{
                            display:none;
                        }
                        
                        table {
                            border-collapse: collapse;
                            width: 100%;
                            table-layout: auto;
                            margin: 0;
                        }
                        
                        tr, th, td {
                            text-align: left;
                            border : 0.5px solid black;
                            padding : 0.4rem;
                        }
                        
                        td, th {
                            font-size: 0.8rem;
                            font-family: Arial;
                            word-spacing: 2px;
                        }
                        th {
                            font-weight: bold;
                        }
                    </style>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handlePrintCarte = () => {
        const printableCarte = document.getElementById('carteP');
        if (printableCarte) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                <head>
                    <title>Carte</title>
                </head>
                <body>
                    ${carteP.innerHTML}
                    <style>
                        .carte1 {
                            height: 15rem;
                            width: 35rem;
                            border: 1px solid #6C9BCF;
                            border-radius: 0.4rem;
                            display: flex;
                            justify-content: space-around;
                            align-items: center;
                            position: relative;
                        }

                        .impCarte{
                            display: none;
                        }
                        
                        .infoQR {
                            width: 55%;
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            font-size: 1rem;
                            font-weight: 600;
                            gap:0;
                        }
                        .infoQR>p {
                            color: #363949;
                            font-family: arial;
                        }
                        
                        .qrCode {
                            width: 13rem;
                            height: 13rem;
                            border: 1px solid #363949;
                            background-color: #f6f6f9;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-radius: 0.4rem;
                        
                        }
                        .codeQR{   
                            width: 10.5rem;
                            height: 10.5rem;
                        }
                        
                    </style>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        }
    };

    //Upload image
    const [selectFile, setSelectFile] = useState(null)
    const [urlFile, setUrlFile] = useState('');

    const handlechangeImg = (e) => {
        const file = e.target.files[0];
        setSelectFile(file);
        setUrlFile(URL.createObjectURL(file));
    }

    const [emp, setEmp] = useState({
        nom: "",
        prenom: "",
        sexe: "",
        cin: "",
        adresse: "",
        mail: "",
        phone: "",
        poste: "",
        photo: null
    })

    function recVal(e) {
        setEmp((em) => ({ ...em, [e.target.name]: e.target.value }));
    }



    const ajoutEmp = async () => {
        try {
            const donnees = new FormData();

            Object.entries(emp).forEach(([key, value]) => {
                donnees.append(key, value);
            });

            donnees.append('photo', selectFile);

            await axios.post('http://localhost:3723/api/ajout/employes', donnees);

            console.log('Employee added successfully');
            setEmp({
                nom: "",
                prenom: "",
                sexe: "",
                cin: "",
                adresse: "",
                mail: "",
                phone: "",
                poste: ""
            });
            recupEmp();
            setSuccesAEmp(true);

        } catch (error) {
            setErreurAEmp(true);
            console.error('Error adding employee', error);
        }
    }



    const recupEmp = async () => {
        try {
            const res = await axios.get('http://localhost:3723/api/recup/employes')
            setListEmP(res.data)
        } catch (error) {
            setErreurAEmp(true);
            console.log(error)
        }
    }

    //RECHERCHE

    const recupEmpSearch = async (para) => {
        try {
            const res = await axios.get(`http://localhost:3723/api/recup/employes/${para}`)
            setListEmP(res.data)
        } catch (error) {
            setErreurAEmp(true);
            console.log(error)
        }
    }

    const handleSearch = (event) => {
        const searchValue = event.target.value;

        if (searchValue === '') {
            recupEmp();
        } else {
            recupEmpSearch(searchValue)
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

    useEffect(() => {
        modifieEmpDebConge();
    }, []);


    //Suppression emp
    const suppressionEmp = async (id) => {
        try {
            await axios.delete(`http://localhost:3723/api/suppression/employes/${id}`);
            recupEmp();
            setTimeout(() => {
                setConfirmSuppEmp(false);
            }, 2);
            setSuccesAEmp(true);

        } catch (error) {
            setErreurAEmp(true);
            console.error('Error deleting data:', error);
        }
    };

    //Modification photo emp

    const [modPhoto, setModPhoto] = useState(false);

    const [selectFile1, setSelectFile1] = useState(null)
    const [urlFile1, setUrlFile1] = useState('');


    const handlechangeImgInf = (e) => {
        const file1 = e.target.files[0];
        setSelectFile1(file1);
        setUrlFile1(URL.createObjectURL(file1));
    }

    const modificationPhoto = async (id) => {
        const donneesP = new FormData();
        donneesP.append('photo1', selectFile1);

        try {
            await axios.put(`http://localhost:3723/api/modification/employesPhoto/${id}`, donneesP);

            recupEmp();
            setSuccesAEmp(true);
            setModPhoto(false);
        } catch (error) {

            setErreurAEmp(true);
            console.error('Error deleting data:', error);
        }
    };
    const [empMod, setEmpMod] = useState({
        nom1: "",
        prenom1: "",
        sexe1: "",
        cin1: "",
        adresse1: "",
        mail1: "",
        phone1: "",
        poste1: ""
    })

    function recValMod(e) {
        setEmpMod((em) => ({ ...em, [e.target.name]: e.target.value }));
    }



    function modrec() {
        setEmpMod({
            nom1: donneeCible.nom,
            prenom1: donneeCible.prenom,
            sexe1: donneeCible.sexe,
            cin1: donneeCible.cin,
            adresse1: donneeCible.adresse,
            mail1: donneeCible.mail,
            phone1: donneeCible.phone,
            poste1: donneeCible.poste

        });
    }



    const modifieEmp = (id) => {

        console.log(empMod);

        try {
            axios.put(`http://localhost:3723/api/modification/employes/${id}`, empMod)
                .then(response => {
                    setSuccesAEmp(true);
                    recupEmp();
                    console.log("Employé mis à jour avec succès");
                    setEmpMod({
                        nom1: "",
                        prenom1: "",
                        sexe1: "",
                        cin1: "",
                        adresse1: "",
                        mail1: "",
                        phone1: "",
                        poste1: ""
                    });
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


    const qrCodeOptions = {
        color: '#000000',
        level: 'Q', //(L, M, Q, H)
    };


    function recupCinPoste() {
        localStorage.setItem('cinEmp', donneeCible.cin);
        localStorage.setItem('posteEmp', donneeCible.poste);
        setTimeout(() => {
            navigate('/conges');
        }, 1000);
    }


    useEffect(() => {
        setTimeout(() => {
            setSuccesAEmp(false);
            setErreurAEmp(false);
        }, 4000);
    }, [succesAEmp, erreurAEmp])


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
                setSuccesAEmp(true);
                setTimeout(() => {
                    setSendmail(false);
                }, 1000);
            }, 500);

        } catch (error) {
            setErreurAEmp(true);
            console.error('Erreur lors de l\'envoi de l\'e-mail :', error);
        }
    };





    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}

        >
            {
                succesAEmp && <Succes />
            }

            {
                erreurAEmp && <Erreur />
            }

            {confirmSuppEmp &&
                <motion.div className="alert confSupp"

                    initial={{ y: -400, x: -180, opacity: 0 }}
                    animate={{ y: -100, opacity: 1 }}

                >


                    <IconButton className='closeA' aria-label="delete" size="large" onClick={() => { setConfirmSuppEmp(false) }}>
                        <CloseIcon />
                    </IconButton>


                    <h3>Confirmation.</h3>
                    <p>Voulez-vous supprimer cet employé ?</p>

                    <div>
                        <Button
                            className='btnOuiSupp'
                            variant="outlined"
                            size="small"
                            color='error'
                            onClick={() => { suppressionEmp(donneeCible.id) }}
                        >
                            Supprimer
                        </Button>
                    </div>
                </motion.div>
            }




            {/* Ajout de nouveau employé */}
            {afficheAjout &&

                <motion.div className="emp">
                    <motion.div className="ajoutEmp"
                        initial={{ y: -1250, x: -350 }}
                        animate={{ y: -380, x: -350 }}
                        transition={{ duration: 0.3 }}
                    >

                        <div className='head'>
                            <h2>Ajouter un employé</h2>
                            <IconButton className='close' aria-label="delete" size="large"
                                onClick={() => { setAfficheAjout(false), setSelectFile(null), setUrlFile('') }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>

                        <div className='cadrephoto'>
                            <div className='photo'>
                                <label className="text" htmlFor="img">
                                    {!selectFile && <AddPhotoAlternateIcon className='iconImg' />}
                                    {selectFile && <img className='img' src={urlFile} alt="" />}
                                </label>
                            </div>
                            <input name='photo' type="file" id='img' onChange={handlechangeImg} />
                        </div>
                        <Box
                            className="ajoutEmp1"
                            component="form"
                            sx={{
                                '& > :not(style)': { m: 1, width: '25rem' },
                            }}
                            noValidate
                            autoComplete="off"
                        >

                            <TextField name='nom' onChange={recVal} className='inputF ajoutF' id="standard-basic" label="Nom" variant="standard" />
                            <TextField name='prenom' onChange={recVal} className='inputF ajoutF' id="standard-basic" label="Prénoms" variant="standard" />
                            <TextField name='cin' onChange={recVal} className='inputF ajoutF' id="standard-basic" label="CIN" variant="standard" />
                            <TextField name='adresse' onChange={recVal} className='inputF ajoutF' id="standard-basic" label="Adresse" variant="standard" />
                            <div>
                                <InputLabel id="typeC">Sexe</InputLabel>
                                <Select
                                    className='select inputF ajoutF'
                                    labelId="typeC"
                                    name='sexe'
                                    value={emp.sexe}
                                    onChange={(event) => setEmp(prevEmp => ({ ...prevEmp, sexe: event.target.value }))}


                                    label="Sexe"
                                    variant="standard"
                                    MenuProps={{ classes: { paper: 'popup', listItem: 'popup' } }}
                                >

                                    <MenuItem value="Masculin">Masculin</MenuItem>
                                    <MenuItem value="Féminin">Féminin</MenuItem>
                                </Select>
                            </div>

                            <TextField name='mail' onChange={recVal} className='inputF ajoutF' id="standard-basic" label="Email" variant="standard" />
                            <TextField name='phone' onChange={recVal} className='inputF ajoutF' id="standard-basic" label="Télephone" variant="standard" />
                            <TextField name='poste' onChange={recVal} className='inputF ajoutF' id="standard-basic" label="Poste" variant="standard" />
                        </Box>
                        <div className='btn'>
                            <Button
                                variant="contained"
                                size="medium"
                                className='btnA'
                                onClick={ajoutEmp}
                            >
                                Ajouter
                            </Button>
                            <Button
                                className='btnB'
                                variant="contained"
                                size="medium"
                                onClick={() => { setAfficheAjout(false), setSelectFile(null), setUrlFile('') }}
                            >
                                Retour
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            }








            {/* Information et modification */}


            {afficheInfo &&

                <div className="emp1">
                    {modPhoto &&
                        <motion.div className="alert modPhoto"

                            initial={{ y: -400, x: -180, opacity: 0 }}
                            animate={{ y: -100, opacity: 1 }}

                        >
                            <IconButton className='closeA' aria-label="modificatio" size="large" onClick={() => { setModPhoto(false) }}>
                                <CloseIcon />
                            </IconButton>


                            <h3>Modification.</h3>
                            <label className='moDph' htmlFor="imgModPhoto">Selectionnez un image</label>
                            <p><input name='photo1' type="file" id='imgModPhoto' onChange={handlechangeImgInf} /></p>

                            <div>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color='primary'
                                    onClick={() => { modificationPhoto(donneeCible.id) }}
                                >
                                    Modifier
                                </Button>
                            </div>
                        </motion.div>
                    }




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
                                <p>A :   {donneeCible.mail}</p>
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
                                    setAfficheInfo(false),
                                        setSelectFile1(null),
                                        setUrlFile1("")
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                        <div className='carte'>
                            <div className="profileP">
                                <div className='profil1'>
                                    <img className='img1' src={urlFile1 ? urlFile1 : "http://localhost:3723/images/" + donneeCible.photo} />

                                    <motion.label className="text1"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => { setModPhoto(true) }}
                                    >
                                        <CameraAltRoundedIcon className='iconImg1' />
                                    </motion.label>
                                </div>
                                <input name='photo1' type="file" id='imgP' onChange={handlechangeImgInf} />
                            </div>
                            <div id='carteP'>
                                <div className='carte1' >
                                    <Button
                                        onClick={handlePrintCarte}
                                        size="small"
                                        variant="contained"
                                        startIcon={<FileDownloadIcon />}
                                        className='impCarte'
                                        aria-label="delete"
                                        color="primary"
                                    >
                                    </Button>
                                    <div className='qrCode'>
                                        <QRCode className='codeQR' value={donneeCible.cin} {...qrCodeOptions} />
                                    </div>
                                    <div className='infoQR'>
                                        <p>Nom : {donneeCible.nom}</p>
                                        <p>Prénoms : {donneeCible.prenom}</p>
                                        <p>CIN : {donneeCible.cin}</p>
                                        <p>E-mail : {donneeCible.mail}</p>
                                        <p>Poste : {donneeCible.poste}</p>

                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className='infEmp1'>
                            <Box
                                className='left'
                                component="form"
                                sx={{
                                    '& > :not(style)': { m: 1, width: '25rem' },
                                }}

                                noValidate
                                autoComplete="off"
                            >
                                <TextField
                                    onChange={recValMod}
                                    InputProps={{
                                        readOnly: !modifierBtn,
                                    }}

                                    defaultValue={donneeCible.nom}
                                    className='inputF'
                                    name="nom1"
                                    label="Nom"
                                    variant="standard"

                                />
                                <TextField

                                    InputProps={{
                                        readOnly: !modifierBtn,
                                    }}
                                    defaultValue={donneeCible.prenom}
                                    className='inputF'
                                    name="prenom1"
                                    label="Prénoms"
                                    variant="standard"
                                    onChange={recValMod}

                                />
                                <TextField
                                    InputProps={{
                                        readOnly: !modifierBtn,
                                    }}

                                    defaultValue={donneeCible.adresse}
                                    className='inputF'
                                    name="adresse1"
                                    label="Adresse"
                                    variant="standard"
                                    onChange={recValMod}
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: !modifierBtn,
                                    }}
                                    defaultValue={donneeCible.cin}
                                    className='inputF'
                                    name="cin1"
                                    label="CIN"
                                    variant="standard"
                                    onChange={recValMod}
                                />

                                <div>
                                    <InputLabel id="typeC">Sexe</InputLabel>
                                    <Select
                                        className='select inputF'
                                        labelId="typeC"

                                        defaultValue={donneeCible.sexe}
                                        onChange={recValMod}
                                        name='sexe1'
                                        label="Sexe"
                                        variant="standard"
                                        MenuProps={{ classes: { paper: 'popup', listItem: 'popup' } }}

                                    >
                                        <MenuItem value="Masculin">Masculin</MenuItem>
                                        <MenuItem value="Féminin">Féminin</MenuItem>

                                    </Select>
                                </div>
                                <TextField
                                    InputProps={{
                                        readOnly: !modifierBtn,
                                    }}

                                    defaultValue={donneeCible.mail}
                                    className='inputF'
                                    name="mail1"
                                    label="Email"
                                    variant="standard"
                                    onChange={recValMod}
                                />
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
                                        readOnly: !modifierBtn,
                                    }}

                                    defaultValue={donneeCible.phone}
                                    className='inputF'
                                    name="phone1"
                                    label="Téléphone"
                                    variant="standard"
                                    onChange={recValMod}
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: !modifierBtn,
                                    }}

                                    defaultValue={donneeCible.poste}
                                    className='inputF'
                                    name="poste1"
                                    label="Poste"
                                    variant="standard"
                                    onChange={recValMod}
                                />

                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCible.statut}
                                    className='inputF'
                                    id="standard-basic"
                                    label="Statut"
                                    variant="standard" />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCible.date_debut}
                                    className='inputF'
                                    id="standard-basic"
                                    label="Date début"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCible.date_fin}
                                    className='inputF'
                                    id="standard-basic"
                                    label="Date fin"
                                    variant="standard"
                                />
                                <TextField
                                    InputProps={{
                                        readOnly: true,
                                    }}

                                    value={donneeCible.reste}
                                    className='inputF'
                                    id="standard-basic"
                                    label="Reste"
                                    variant="standard"
                                />
                            </Box>
                        </div>
                        <div className='btn'>
                            {!modifierBtn &&
                                <Button
                                    variant="contained"
                                    size="medium"
                                    className='btnA'
                                    onClick={() => { setModifierBtn(true), modrec() }}
                                >
                                    Editer
                                </Button>
                            }
                            {modifierBtn &&
                                <Button
                                    variant="contained"
                                    size="medium"
                                    color="primary"
                                    onClick={() => { modifieEmp(donneeCible.id), setModifierBtn(false) }}
                                >
                                    Enregistrer
                                </Button>
                            }
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={() => { setSendmail(true), setMail({ a: donneeCible.mail }) }}
                            >
                                Envoyer un e-mail
                            </Button>

                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                onClick={() => { recupCinPoste() }}
                            >
                                Prendre un conge
                            </Button>
                            <Button
                                variant="contained"
                                size="medium"
                                color="error"
                                onClick={() => { setConfirmSuppEmp(true) }}
                            >
                                Supprimer
                            </Button>
                        </div>
                    </motion.div>
                </div>
            }











            <div className='liste' id='divToPrint'>
                <div className='ajoutImp'>
                    <div className='rechercheP'>
                        <TextField
                            id="filled-search"
                            label="Recherche"
                            type="search"
                            variant="standard"
                            size='small'
                            className='recherche'
                            onChange={handleSearch}
                        />
                        <IconButton className='record' aria-label="record" size="large">
                            <KeyboardVoiceIcon />
                        </IconButton>
                    </div>
                    <div className='ajoutImpBtn'>
                        <Button
                            className='btnAjout'
                            variant="outlined"
                            size="small"
                            onClick={() => { setAfficheAjout(true) }}
                        >
                            Nouveau
                        </Button>
                        <Button
                            variant="outlined"
                            size="small"
                            className='btnImp'
                            onClick={handlePrint}
                        >
                            Imprimer la liste
                        </Button>
                    </div>

                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénoms</th>
                            <th>CIN</th>
                            <th>E-mail</th>
                            <th>Poste</th>
                            <th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ListEmp.map((em) => (
                            <motion.tr key={em.id}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}

                                onClick={() => { setDonneeCible(em), setAfficheInfo(true), setModifierBtn(false) }}
                            >
                                <td>{em.nom}</td>
                                <td>{em.prenom}</td>
                                <td>{em.cin}</td>
                                <td>{em.mail}</td>
                                <td>{em.poste}</td>
                                <td>{em.statut}</td>
                            </motion.tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </motion.div>
    )
}