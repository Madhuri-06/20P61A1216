import{ useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

type Props = {}

const Home = (props: Props) => {
    const navigate = useNavigate();
    useEffect(() => {
        console.log(localStorage.getItem('token'));
        if (localStorage.getItem('token')) {
            
            navigate('/products');
        }
        else {
            fetch('http://localhost:9876/auth')
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if (data.access_token) {
                        localStorage.setItem('token', data.access_token);
                        navigate('/products');
                    }
                })
                .catch(err => console.log(err));
        }
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <h1>Register</h1>
            </header>
        </div>
    )
}

export default Home