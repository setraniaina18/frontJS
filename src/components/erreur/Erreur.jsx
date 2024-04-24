import { IconButton, duration } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Erreur.css';
import { motion } from 'framer-motion';
import {  useEffect, useState } from 'react';

export function Erreur() {
    const [isErreur, setIsErreur] = useState(true);


    function hide(){
            setIsErreur(false);
    };

    useState(()=>{
        setTimeout(() => {
            hide();
        }, 3000);
    }, []);

    return (

        <>
            {isErreur &&
                <motion.div className="erreurComp"

                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}

                >
                    <p>L'opération a échoué.</p>
                    <IconButton className='closeErreur' aria-label="delete" size="small" onClick={() => { setIsErreur(false) }}>
                        <CloseIcon />
                    </IconButton>
                </motion.div>
            }
        </>
    )
}