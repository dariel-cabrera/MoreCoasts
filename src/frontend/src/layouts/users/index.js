import { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";


function Users(){
    const [user,setUser]=useState({
        name:"",
        apellido:"",
        user:"",
        email:"",
        password:"",
        ci:""
    });
    
}