export default function Signup() {
  const [info, setInfo] = useState({
    address: "",
    date_of_birth: "",
    district: "",
    email: "",
    first_name: "",
    gender: "",
    password  : "",
    phone_no: "",
    postcode: "",
    province : "",
    role: "",
    sub_district: "",
    sub_role: "",
    user_name: "",
    last_name: "",
  });
  const [message, setMessage] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/users/register", {method: "POST", body: info})
      .then((res) => {
        console.log(res.data);
        setMessage(res.data.message);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const changeHandler = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input

                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                onChange={changeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input

                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                onChange={changeHandler}
              />
            </div>
            <div className="form-group">
              <label htmlFor="user_name">User Name</label>
              <input
              