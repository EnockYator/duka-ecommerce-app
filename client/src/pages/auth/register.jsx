import CommonForm from "@/components/common/authForm";
import { registerFormControls } from "@/config";
import { useAuth } from "@/custom_hooks/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AuthRegister() {

    const { actions } = useAuth();
    const { registerUser } = actions;

    const navigate = useNavigate();

    const initialState = {
        userName: "",
        email: "",
        password: "",
    };

    const [formData, setFormData] = useState(initialState);
    const [errors, setErrors] = useState(null);

    const validators = {
        userName: (val) => {
            if (!val || val.trim() === "") {
                return "User name is required"
            }
            if (val.length < 3) {
                return "User name must be at least three letters long"
            }
            return ""
        },
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
            const response = await registerUser(formData).unwrap();
            console.log("Registration successful:", response);
            navigate('/auth/login');

        } catch (err) {
            setErrors({ general: err.message || "Registration failed" });             
        } finally{
            setFormData(initialState); // reset form data
        }
    };


    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            
            <h3 className="text-3xl font-bold tracking-tight text-foreground text-center">Create a new account</h3>
                
            <CommonForm 
            formControls={registerFormControls}
            buttonText="Sign Up"
            formData={formData}
            setFormData={setFormData}
            errors={errors || {}}   // always pass an object
            setErrors={setErrors}
            validators={validators}
            onSubmit={onSubmit}
            />
           
                        
            <p className="text-center">
                Already have an account?
                <Link className="font-medium text-primary hover:underline ml-2" to="/auth/login">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default AuthRegister;