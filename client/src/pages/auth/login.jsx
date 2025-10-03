import CommonForm from "@/components/common/authForm";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/authSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function AuthLogin() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const initialState = {
        email: "",
        password: "",
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState(null);

    const validators = {
        email: (val) => {
            if (!val || val.trim() === "") {
                return "Email is required"
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                return "Email format is invalid"
            }
            return ""
        },
        password: (val) => {
            if (!val || val.trim() === "") {
                return "Password is required"
            }
            if (val.length < 8) {
                return "Password must be at least 8 characters long"
            }
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
            if (!passwordRegex.test(val)) {
                return "Password must include atleast 1 uppercase letter, number and a special character"
            }
            return ""
        },
    };

    async function onSubmit() {
        try {
            
            // dispatch register action
            const response = await dispatch(loginUser(formData)).unwrap();
            console.log("Login successful:", response);
            navigate('/shop/home');

        } catch (err) {
            setErrors({ general: err.message || "Login failed" });             
        } finally{
            setFormData(initialState); // reset form data
        }
    };


    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            
            <h3 className="text-3xl font-bold tracking-tight text-foreground text-center">Create a new account</h3>
                
            <CommonForm 
            formControls={loginFormControls}
            buttonText="Login"
            formData={formData}
            setFormData={setFormData}
            errors={errors || {}}   // always pass an object
            setErrors={setErrors}
            validators={validators}
            onSubmit={onSubmit}
            />
           
                        
            <p className="text-center">
                Don't have an account?
                <Link className="font-medium text-primary hover:underline ml-2" to="/auth/register">
                    Register
                </Link>
            </p>
        </div>
    );
}

export default AuthLogin;