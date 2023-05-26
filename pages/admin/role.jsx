import Template from "@/components/Template";
import MagnifyIcon from "@/components/icons/MagnifyIcon";
import { useEffect, useState } from "react";


export default function role() {
  const [employee, setEmployee] = useState([]);
  const [role, setRole] = useState([]);

  const [filter, setFilter] = useState({
    name: "",
    sub_role: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch('/api/admin/getemployeerole',
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
            },
            })
            .then((res) => res.json())
            .then((data) => {
                setRole(data.getemployeerole);
            }
            );
            fetch('/api/admin/getemployee',
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "auth-token": token,
              },
            })
            .then((res) => res.json())
            .then((data) => {
              setEmployee(data.getemployee);
            });
    }
  }, []);

  const submitFilter = () => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`/api/admin/getemployee?name=${filter.name}&sub_role=${filter.sub_role}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        })
        .then((res) => res.json())
        .then((data) => {
          setEmployee(data.getemployee);
        });
    }
  };

  const updateRole = (e, account_id) => {
    const token = localStorage.getItem("token");
    fetch("/api/admin/updaterole",
      { 
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({
          account_id: account_id,
          subrole_id: e.target.value,
        }),
      })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Role updated successfully");
        } else {
          alert("Role updated failed");
        }
        // rerender employee list
        fetch(`/api/admin/getemployee?name=${filter.name}&sub_role=${filter.sub_role}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": token,
            },
          })
          .then((res) => res.json())
          .then((data) => {
            setEmployee(data.getemployee);
          }
        );
      });
  };

  const mapSubroleIdToName = (subrole_id) => {
    console.log(subrole_id);
    const subrole = role.find((role) => role.subrole === subrole_id);
    
    return subrole ? subrole.sub_name : "-";
  };

  return(
    <Template hscreen>
      <div className="bg-[#F5F5F5] w-[75%] h-full mt-16 rounded-t-md px-[6rem] pt-8 flex flex-col  place-items-center">
        <div className="w-full text-4xl font-semibold text-center h-[15%] pt-4">Role Management</div>
        <div className="flex w-full gap-4 px-8 text-lg ">
          <div className="w-[90%] rounded-md drop-shadow bg-[#FAFCFE] place-items-center px-4 flex divide-x">
            <div className="flex w-[80%]">
              <MagnifyIcon/>
              <input
                type="text"
                className=" placeholder:text-[#C4C4C4] outline-none px-4 bg-[#FAFCFE] w-full"
                placeholder="Search by name"
                onChange={(e) => {
                  setFilter({ ...filter, name: e.target.value });
                }}
              />
            </div>
            <div className="flex w-[20%]">
              <select
                className="w-full outline-none px-4 bg-[#FAFCFE] appearance-none"
                onChange={(e) => {
                  setFilter({ ...filter, sub_role: e.target.value });
                }}
              >
                <option value="">All</option>
                {role.map((item, index) => (
                  <option key={index} value={item.sub_role}>
                    {item.sub_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div 
            className="w-[10%] rounded-md text-center font-semibold text-white bg-[#6C6EF2] py-2 uppercase"
            
            >
            Search
          </div>
        </div>
        <div className="flex flex-col mt-8 w-[95%] h-[32rem] p-8 drop-shadow rounded-md bg-[#FAFCFE]">
          <div className="flex w-full h-[10%] text-lg font-semibold text-black overflow-y-auto">
            <div className="w-[25%] text-center">User Name</div>
            <div className="w-[25%] text-center">First Name</div>
            <div className="w-[25%] text-center">Last Name</div>
            <div className="w-[25%] text-center">Position</div>
          </div>
          <div className="flex flex-col w-full h-[90%] text-lg font-semibold text-[#8C8CA1] overflow-y-auto">
            {employee.map((item, index) => (
              <div key={index} className="flex w-full h-[10%] text-lg font-medium text-[#8C8CA1] overflow-y-auto">
                <div className="w-[25%] text-center">{item.user_name}</div>
                <div className="w-[25%] text-center">{item.first_name}</div>
                <div className="w-[25%] text-center">{item.last_name}</div>
                <select
                  className="w-[25%] text-center outline-none px-4 bg-[#FAFCFE] appearance-none"
                  onChange={(e) => {
                    updateRole(e, item.account_id);
                  }}
                >
                  {role.map((role, index) => (
                    <option 
                      key={index} 
                      value={role.sub_role}
                      selected={role.sub_role === item.sub_role}
                      >
                      {role.sub_name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>

    </Template>
  )
}