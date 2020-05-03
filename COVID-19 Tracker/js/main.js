window.addEventListener('load', function(e) 
{
    const COVID_19_API_SUMMARY = 'https://api.covid19api.com/summary';

    //Display Containers
    let displayInfo = document.querySelector(".display");
    let displayDateTitle = document.querySelector(".date-title");

    //Errors
    let errMsg = document.querySelector(".error-msg");
    let errMsgContent = document.querySelector(".error-msg span");

    fetch (COVID_19_API_SUMMARY).then((response) => {
        return response.json()
        }).then((covidData) => {
        displayCOVID19Data(covidData);
        }).catch((err) => {
             console.log(`Some error(s) occured: ${err}`);
             errMsg.classList.remove("error-msg");
             errMsgContent.textContent = `${err}`;
        });

    const displayCOVID19Data = async(data) => {
        let global = await(data.Global);
        let jsonDate = await(data.Date);

        let date = new Date(jsonDate).toLocaleString();

        //Toatls Destructuring
        let {TotalConfirmed: totalConfirmed, TotalRecovered: totalRecovered, TotalDeaths: totalDeaths} = global;

        //New Stats Destructuring
        let {NewConfirmed: newConfirmed, NewRecovered: newRecovered, NewDeaths: newDeaths} = global;

        //Totals 
        let totalConfirmedLabel = displayInfo.querySelector(".card-confirmed .total-confirmed-label");
        let totalRecoveredLabel = displayInfo.querySelector(".card-recovered .total-recovered-label");
        let totalDeathsLabel = displayInfo.querySelector(".card-deaths .total-deaths-label");

        //Date Updated
        let dateTimeShow = displayDateTitle.querySelector(".date-time span");

        //New Stats
        let newConfirmedShow = displayInfo.querySelector(".card-confirmed .new-stats .new-confirmed span");
        let newRecoveredShow = displayInfo.querySelector(".card-recovered .new-stats .new-recovered span");
        let newDeathsShow = displayInfo.querySelector(".card-deaths .new-stats .new-deaths span");

        //Display Updated Date
        dateTimeShow.innerHTML = `<i class="far fa-clock"></i> Updated: ${date}`;

        //Display Totals
        totalConfirmedLabel.innerText = `${totalConfirmed}`;
        totalRecoveredLabel.innerText = `${totalRecovered}`;
        totalDeathsLabel.innerText = `${totalDeaths}`;
        
        //Display New Stats
        newConfirmedShow.innerText = `${newConfirmed}`;
        newRecoveredShow.innerText = `${newRecovered}`;
        newDeathsShow.innerText = `${newDeaths}`;

        //Count Up Totals Animation
        let countTotalConfirmed = new CountUp("total-confirmed", 0, totalConfirmed);
        countTotalConfirmed.start();

        let countTotalRecovered = new CountUp("total-recovered", 0, totalRecovered);
        countTotalRecovered.start();

        let countTotalDeaths = new CountUp("total-deaths", 0, totalDeaths);
        countTotalDeaths.start();

        //Count Up New Stats Animation
        let countNewConfirmed = new CountUp("new-confirmed", 0, newConfirmed);
        countNewConfirmed.start();

        let countNewRecovered = new CountUp("new-recovered", 0, newRecovered);
        countNewRecovered.start();

        let countNewDeaths = new CountUp("new-deaths", 9, newDeaths);
        countNewDeaths.start();

        displayDataByCountry(data);
        displayAllCountries(data);

    }//displayCOVID19Data END

    const displayDataByCountry = (country) => {
        let displayCountryInfo = document.querySelector(".countries .display-country");
        
        //Find Dropdown List by Id
        let dropdown = document.getElementById('country-select');
        dropdown.length = 0;

        let option;
        let data = country.Countries;

        //Populate Dropdown with Countries
        for (let i = 0; i < data.length; i++) 
        {
            option = document.createElement('option');
            option.text = data[i].Country;
            option.value = i;
            dropdown.add(option);
        }

        //When Country Selected
        dropdown.addEventListener("change", (e) => {
            e.preventDefault();

            //Get Value from Selected Country
            let optionValue = e.target.value;

            let selectedCountryData = data[optionValue];

            let 
            {
                Country: countryName,
                CountryCode: countryCode,
                Date: countryDate,
                NewConfirmed: countryNewConfirmed, 
                NewRecovered: countryNewRecovered,
                NewDeaths: countryNewDeaths,
                TotalConfirmed: countryTotalConfirmed,
                TotalRecovered: countryTotalRecovered,
                TotalDeaths: countryTotalDeaths
            } = selectedCountryData;
            
            //Card Section displays New Data by Selected Country
            let showCard = document.querySelector(".card-new-stats")

            if(countryName !="")
            {
                showCard.classList.remove("hidden-card");
            }

            let newConfirmedByCountry = displayCountryInfo.querySelector(".card-new-stats .country-new-confirmed span");
            let newRecoveredByCountry = displayCountryInfo.querySelector(".card-new-stats .country-new-recovered span");
            let newDeathsByCountry = displayCountryInfo.querySelector(".card-new-stats .country-new-deaths span");
            let countryDateTime = displayCountryInfo.querySelector(".card-new-stats .country-date span");

            //Display New Data
            newConfirmedByCountry.innerText = `${countryNewConfirmed}`;
            newRecoveredByCountry.innerText = `${countryNewRecovered}`;
            newDeathsByCountry.innerText = `${countryNewDeaths}`;
            countryDateTime.innerText = `${new Date(countryDate).toLocaleString()}`;
          
          // Apexcharts:
          let options = {
              series: [{
              name: 'Total Confirmed',
              data: [countryTotalConfirmed]
            }, {
              name: 'Total Recovered',
              data: [countryTotalRecovered]
            }, {
              name: 'Total Deaths',
              data: [countryTotalDeaths]
            }, ],
              chart: {
              type: 'bar',
              height: 350,
              stacked: true,
              stackType: '100%'
            },
            plotOptions: {
              bar: {
                horizontal: true,
              },
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
            title: {
              text: countryName + ", " + countryCode
            },
            fill: {
              opacity: 1,
              colors:['rgba(252, 252, 2, 0.56)', 'rgba(2, 252, 2, 0.56)', 'rgba(252, 2, 2, 0.56)']
            },
            legend: {
              position: 'top',
              horizontalAlign: 'left',
              offsetX: 40
            },
            colors:['rgba(252, 252, 2, 0.56)', 'rgba(2, 252, 2, 0.56)', 'rgba(252, 2, 2, 0.56)'],
            dataLabels: {
              style: {
                colors: ['#000000']
              }
            }
          };
  
          var chart = new ApexCharts(document.querySelector("#covidChart"), options);
          chart.render();
          chart.resetSeries();
        })//Event Listener End

    }//displayDataByCountry End

    //Display All Countries
    const displayAllCountries = (data) => {
        let dataTable = document.querySelector(".collapse-data .display-all-countries-data .table-countries-data tbody");

        data.Countries.map((c) => {
          dataTable.innerHTML += ` 
                  <tr>
                    <td>${c.Country} (${c.CountryCode})</td>
                    <td><span class="badge badge-warning">${c.TotalConfirmed}</span></td>
                    <td><span class="badge badge-success">${c.TotalRecovered}</span></td>
                    <td><span class="badge badge-danger">${c.TotalDeaths}</span></td>
                    <td><span class="badge badge-warning">NEW ${c.NewConfirmed}</span></td>
                    <td><span class="badge badge-success">NEW ${c.NewRecovered}</span></td>
                    <td><span class="badge badge-danger">NEW ${c.NewDeaths}</span></td>
                  </tr>
            `;
        })
    }

})//load end
