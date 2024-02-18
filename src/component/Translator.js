import languages from "../languages";
import {useState} from "react";

function Translator(){

    const [fromText, setFromText] = useState('');
    const [toText, seTtoText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('en-GB');
    const [toLanguage, setToLanguage] = useState('hi-IN');
    const [loading, setLoading] = useState(false);

    function handleExchange(){
        let tempValue = fromText;
        setFromText(toText);
        seTtoText(tempValue);

        tempValue = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(fromLanguage);
    }


    // const copyText = (text) => 
    function copyText(text){
        navigator.clipboard.writeText(text);
    }
    // const utterText = (text, language) => 
    function utterText(text, language){
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;

        const synth = window.speechSynthesis;
        synth.speak(utterance);
    }
    const handleIconClick = (event, id) => {
        if(event.target.classList.contains('fa-copy')){
            if(id=='from'){
                copyText(fromText);
            }
            else{
                copyText(toText);
            }
        }
        else{
            if(id=='from'){
                utterText(fromText, fromLanguage);
            }
            else{
                utterText(toText, toLanguage);
            }
        }
    }

    const handleTranslate = () => {
        setLoading(true);
        let url = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`;
        fetch(url)
        .then((res) => res.json())
        .then((data) => {
            seTtoText(data.responseData.translatedText);
            setLoading(false);
        })
        setLoading(false);
    }

    return (
        <>
            <div className="wrapper">
                <div className="text-input">
                    <textarea className="from-text" name="from" id="from" placeholder="Enter Text" value={fromText} onChange={(event) => setFromText(event.target.value)}></textarea>

                    <textarea className="to-text" name="to" id="to" value={toText} readOnly></textarea>
                </div>

                <ul className="controls">
                    <li className="row from">
                        <div className="icons">
                            <i id="from" class="fa-solid fa-volume-high" onClick={(event) => handleIconClick(event, 'from')}></i>
                            <i id="from" class="fa-solid fa-copy" onClick={(event) => handleIconClick(event, 'from')}></i>
                        </div>

                        <select value={fromLanguage} onChange={(event) => setFromLanguage(event.target.value)}>
                            {
                                Object.entries(languages).map(([code, name]) => (
                                    <option key={code} value={code}>{name}</option>
                                ))
                            }
                        </select>
                    </li>
                    
                    <li className="exchange" onClick={handleExchange}>
                        <i class="fa-solid fa-arrow-right-arrow-left"></i>
                    </li>
                    
                    <li className="row to">
                        <select value={toLanguage} onChange={(event) => setToLanguage(event.target.value)}>
                            {
                                Object.entries(languages).map(([code, name]) => (
                                    <option key={code} value={code}>{name}</option>
                                ))
                            }
                        </select>

                        <div className="icons">
                            <i id="to" class="fa-solid fa-copy" onClick={(event) => handleIconClick(event, 'to')}></i>
                            <i id="to" class="fa-solid fa-volume-high" onClick={(event) => handleIconClick(event, 'to')}></i>
                        </div>
                    </li>
                </ul>
            </div>
            <button onClick={handleTranslate}>{loading ? 'Translating' : 'Translate Text'}</button>
        </>
    )
}

export default Translator