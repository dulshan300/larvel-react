import React, { useEffect, useState } from 'react'

const useValidationError = () => {
    const [errors, setErrors] = useState([]);
    const [entries, setEntries] = useState([]);

    useEffect(() => {

        setEntries(Object.entries(errors));

    }, [errors])
    
    let showErrors;
    if (entries.length > 0) {
        showErrors = <div className="flex flex-col gap-1 bg-gradient-to-b from-red-500 to-orange-700/75 p-2 my-3 rounded shadow-lg">

            {entries.map((e, i) => <span key={i} className='font-bold text-sm text-white'>- {e[1]}</span>)}


        </div>
    }  


    return { setErrors, showErrors }


}

export default useValidationError