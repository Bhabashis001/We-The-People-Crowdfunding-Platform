import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../Context/userContext';
import "./ReviewForm.css";
import axios from '../../Axios/axios';
const ReviewForm = () => {
    const navigate = useNavigate();
    const context = useContext(UserContext);
    let { showAlert, startupData, setPaymentSuccess } = context;
    const [credentials, setCredentials] = useState({ ideaRating: 0, approachRating: 0, websiteRating: 0, instagramRating: 0 })
    const [active, setActive] = useState("");
    const [missingStartup, setMissingStartup] = useState(false);

    // If neither context nor persisted id exist, show a friendly inline message instead of redirecting
    React.useEffect(() => {
        const startupId = startupData?._id || localStorage.getItem('reviewStartupId');
        setMissingStartup(!startupId);
    }, [startupData]);

    const onChange = (e) => {
        e.preventDefault();
        setActive("button_active");
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { ideaRating, approachRating, websiteRating, instagramRating } = credentials;
        let overallRating = (parseInt(ideaRating) + parseInt(approachRating) + parseInt(websiteRating) + parseInt(instagramRating)) / 4;

        // Determine startup id: prefer context, fallback to stored id saved during payment
        const startupId = startupData?._id || localStorage.getItem('reviewStartupId');
        if (!startupId) {
            // Friendly inline handling: set missing state and show an actionable message instead of forcing a navigation
            setMissingStartup(true);
            showAlert("We couldn't identify which startup you're trying to review. Please go to the startup page and click 'Back this project' or return to your Dashboard.", "error");
            return;
        }

        try {
            const response = await axios.post('/api/investor/review', {
                Startup_id: startupId, ideaRating, approachRating, websiteRating, instagramRating, overallRating
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token":
                        localStorage.getItem('token'),
                },
            });
            if (response && response.data && response.data.success) {
                showAlert(response.data.msg, "success");
                // cleanup persisted id after successful review
                try { localStorage.removeItem('reviewStartupId'); } catch (e) { /* ignore */ }
            }
        } catch (error) {
            let errorMsg = error.response?.data?.msg || error.response?.data?.error;
            if (error.response?.data?.errors) {
              errorMsg = error.response.data.errors.map(err => err.msg).join(', ');
            }
            showAlert(errorMsg || 'Failed to submit review');
        }
        setCredentials({ ideaRating: 0, approachRating: 0, websiteRating: 0, instagramRating: 0 });
        setPaymentSuccess(false);
        navigate("/dashboard");
    }
    return (
        <>
            <div className="card mb-3 mx-auto my-5 startup_form">
                <div className="row g-0">
                    <div className="col-md-5 col-sm-12">
                        <img src="https://www.pcg-services.com/wp-content/uploads/2016/08/startup-business-strategy-1.jpg" className="img-fluid rounded-start review_image" alt="startup-image" />
                    </div>
                    <div className="col-md-7 col-sm-12">
                        <div className="card-body">
                            <h5 className="card-title text-center">Startup Rating Form</h5>

                            {missingStartup ? (
                                <div className="my-4 text-center">
                                    <p className="text-muted">We couldn't identify which startup you're trying to review.</p>
                                    <p>Please visit the startup page and click <strong>Back this project</strong> to be redirected to this form, or go back to your Dashboard.</p>
                                    <div className="mt-3">
                                        <button className="btn btn-primary me-2" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                                        <button className="btn btn-outline-primary" onClick={() => navigate(-1)}>Go back</button>
                                    </div>
                                </div>
                            ) : (
                                <form className="my-4">
                                    <label for="exampleInputPassword1" className="form-label text-muted mb-3">How much rating will you give:</label>
                                    <div className="mb-3">
                                        <label for="exampleInputPassword1" className="form-label text-muted">To the idea and the vision?</label>
                                        <select name="ideaRating" className="form-select rating_btn" onChange={onChange} aria-label="Default select example">
                                            <option selected>Open this select menu</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label for="exampleInputPassword1" className="form-label text-muted">To their approach of solving the problem?</label>
                                        <select name="approachRating" className="form-select rating_btn" onChange={onChange} aria-label="Default select example">
                                            <option selected>Open this select menu</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label for="exampleInputPassword1" className="form-label text-muted">To the website of the Startup?</label>
                                        <select name="websiteRating" className="form-select rating_btn" onChange={onChange} aria-label="Default select example">
                                            <option selected>Open this select menu</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label for="exampleInputPassword1" className="form-label text-muted">To the Instagram page of the Startup?</label>
                                        <select name="instagramRating" className="form-select rating_btn" onChange={onChange} aria-label="Default select example">
                                            <option selected>Open this select menu</option>
                                            <option value={1}>1</option>
                                            <option value={2}>2</option>
                                            <option value={3}>3</option>
                                            <option value={4}>4</option>
                                            <option value={5}>5</option>
                                        </select>
                                    </div>
                                    <button className="my-5 btn form_submit_btn" onClick={handleSubmit}>Submit</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewForm;