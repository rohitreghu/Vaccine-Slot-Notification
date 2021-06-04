import React, { useEffect, useState } from "react";
import Axios from "axios";

function App() {

  const [centers, setCenters] = useState("");
  const [fetch, setFetch] = useState(0);

  
  useEffect(() => {
    setFetch(0);
  }, [])

  useEffect(() => {
    var interval = setTimeout(() => {
      setFetch((fetch) => fetch+1);
    }, 60000)

    var firstHalf = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=312&date=";

    var today = new Date()
    var date = today.getDate() + 1
    var secondHalf = "-06-2021";

    const url = firstHalf + date + secondHalf

    Axios.get(url)
      .then((response) => {
        // console.log(response.data);
        var temp = response.data.sessions.filter((center) => center.min_age_limit === 18 && center.available_capacity_dose1 > 10);
        setCenters(temp);
      })
      .catch((err) => {
        setCenters("");
        console.log(err);
      })

  }, [fetch])

  useEffect(() => {
    if (centers.length > 0){
      hitDiscord();
    }
  }, [centers])

  const hitDiscord = () => {
    const article = { content: 'Slot available' };
    const headers = { 
      'Content-Type': 'application/json'
  };

    Axios.post('https://discord.com/api/webhooks/845958079812206642/Y59a4VDAUGmuGlL58yd46ju-YilrHLrrF4x5tn_BeGNe7Flo-V3EDCjPVaCNeh6Vhh1s', article, {headers})
        .catch(error => {
            console.error('There was an error!', error);
        });
  }

  return (
    <div>
      Slot available for 18+ for 1st dose of vaccination at:

      {centers && centers.map((center, index) => {
       return <p key={index}>{center.name}</p>
      })}
    </div>
  )
}

export default App;
