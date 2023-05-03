import { useState } from "react"

function useInput(val) {
    const [value, setValue] = useState(val);
    
    function handleChange(event) {
        setValue(event.target.value);
    }

    function reset(data = "") {
        setValue(data)
    }

    const bind = {
        value,
        onChange:handleChange
    }

    return [
        value,
        bind,
        reset
    ]

}

export default useInput