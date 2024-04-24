import { IconButton, duration } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Succes.css';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Succes() {
    const [isSucces, setIsSucces] = useState(true)
    function hide() {
        setIsSucces(false);
    }

    useState(() => {
        setTimeout(() => {
            hide();
        }, 3000);
    }, []);
    return (

        <>
            {isSucces &&
                <motion.div className="succesComp"

                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5 }}

                >
                    <p>Opération réussite avec succèes.</p>
                    <IconButton className='closeSucces' aria-label="delete" size="small" onClick={() => { hide() }}>
                        <CloseIcon />
                    </IconButton>
                </motion.div>
            }
        </>
    )
}