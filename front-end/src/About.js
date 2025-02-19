import { useState, useEffect } from 'react'
import axios from 'axios'
import './About.css';
// import Bio from './Bio';

/**
 * A React component that displays my bio
 * @param {*} param0 an object holding any props passed to this component from its parent component
 * @returns The contents of this component in JSX form
 */
const About = props => {
    const [about_bio, set_about_bio] = useState([]);
    const [error, setError]= useState([]);

    /**
     * Fetches from the back-end
     */
    const fetchBio = () => {
        axios
            .get(`${process.env.REACT_APP_SERVER_HOSTNAME}/about`)
            .then(response => {
                const about_bio = response.data;
                set_about_bio(about_bio);
            })
            .catch(err => {
                const errMsg = JSON.stringify(err, null, 2);
                setError(errMsg);
                console.log(error);
            })
    }

    /**
     * Calls fetching function
     */
    useEffect(fetchBio, []);

    return (
        <>
            <h1>{about_bio.name}</h1><br/>
            <div class="flex-container">
            <img src={about_bio.image_url} alt="My Photo" width="450"/>  
            <div>
                <p class="about">{about_bio.paragraph_one}</p><br/>
                <p class="about">{about_bio.paragraph_two}</p>
            </div>      
            </div>
        </>
    )
}

// make component available to be imported
export default About