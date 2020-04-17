$(function() {
let dataTable;
const API_ROOT_LUAR = 'https://api.kawalcorona.com';
const API_ROOT_DALAM = 'https://kokngopas.my.id/api';
const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
$.ajax({
        url: API_ROOT_LUAR,
        dataType: 'json',
        success: function(data) {
            for (let i=0; i<data.length; i++) {
              if(data[i].attributes.Country_Region == 'Indonesia'){
                const convert = new Date(data[i].attributes.Last_Update);
                const Tanggal = convert.getDate();
                const Bulan = bulan[convert.getMonth()];
                const Tahun = convert.getFullYear();
                const jam = convert.getHours();
                const menit = convert.getMinutes();
                const detik = convert.getSeconds();
                document.getElementById("update_date").innerHTML=`${Tanggal} ${Bulan} ${Tahun} ${jam}:${menit}:${detik} WIB`;
                break;
              }
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('Terjadi Kesalahan, Silahkan Reload Ulang');
        }
    });


    $.ajax({
        url: API_ROOT_LUAR+'/indonesia/',
        dataType: 'json',
        success: function(data) {
          document.getElementById("p").innerHTML=data[0].positif + ' Orang';
          document.getElementById("s").innerHTML=data[0].sembuh+ ' Orang';
          document.getElementById("m").innerHTML=data[0].meninggal+ ' Orang';
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('Terjadi Kesalahan, Silahkan Reload Ulang');
        }
    });

    $.ajax({
        url: API_ROOT_DALAM+'/latlong/',
        dataType: 'json',
        success: function(data) {
         let latlong = [];
            for (let i=0; i<data.length; i++) {
              latlong[data[i].attributes.Kode_Provi] = [data[i].attributes.lat,data[i].attributes.long];
            }
            $.ajax({
                url: API_ROOT_LUAR+'/indonesia/provinsi/',
                dataType: 'json',
                success: function(data) {
                    function content(title,positif,sembuh,meninggal){
                      return `<table border="0">
                      <tr>
                        <td colspan="3" align="center"><strong>${title}</strong></td>
                      </tr>
                      <tr>
                        <td>Positif</td>
                        <td>:</td>
                        <td>${positif}</td>
                      </tr>
                      <tr>
                        <td>Sembuh</td>
                        <td>:</td>
                        <td>${sembuh}</td>
                      </tr>
                       <tr>
                        <td>Meninggal</td>
                        <td>:</td>
                        <td>${meninggal}</td>
                      </tr>
                    </table>`;
                    } 

                    let locations = [];

                    let tb,no=1;
                    for (let i=0; i<data.length; i++) {
                        tb += '<tr><td>' + no + '</td><td>' + data[i].attributes.Provinsi + '</td><td>' + data[i].attributes.Kasus_Posi + '</td><td>'+ data[i].attributes.Kasus_Semb + '</td><td>'+ data[i].attributes.Kasus_Meni + '</td></tr>';
                        locations[i] = [content(data[i].attributes.Provinsi,data[i].attributes.Kasus_Posi,data[i].attributes.Kasus_Semb,data[i].attributes.Kasus_Meni), latlong[data[i].attributes.Kode_Provi][0],  latlong[data[i].attributes.Kode_Provi][1]];
                        no++;
                    }
                    $('#body_statistik').append(tb);
                    dataTable = $('#tb_statistik').DataTable({
                      "paging": false,
                      "lengthChange": false,
                      "searching": true,
                      "ordering": true,
                      "info": false,
                      "autoWidth": false
                    });
                    $("#filterBox").keyup(function() {
                       dataTable.search(this.value).draw();
                    }); 
                    $('#tb_statistik_filter').hide();
                  
                    // start map
                      let mymap = L.map('map').setView([-2.600029, 118.015776], 4);

                      L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                        maxZoom: 18,
                        id: 'mapbox/streets-v11',
                        tileSize: 512,
                        zoomOffset: -1,
                        accessToken: 'pk.eyJ1Ijoicml6YWw5NyIsImEiOiJjazhkdTJ0dXoweWQ4M2tsNmIwMm9panZ1In0.a2-JMKhdAZ450uHDKr9WRg'
                    }).addTo(mymap);
                     
                         
               
                    
                    for (let i = 0; i < locations.length; i++) {
                      marker = new L.marker([locations[i][1], locations[i][2]])
                        .bindPopup(locations[i][0])
                        .addTo(mymap);
                    }
                    // End Map
                    
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert('Terjadi Kesalahan, Silahkan Reload Ulang');
                }
            });

        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('Terjadi Kesalahan, Silahkan Reload Ulang');
        }
    });

    
    $.ajax({
        url: API_ROOT_DALAM+'/statistik',
        dataType: 'json',
        beforeSend: function(){
          // Show image container
          $("#customloader").show();
          $("#customloader2").show();
       },
        success: function(data) {
        let arrLabels = new Array();         
        let arrDataPositif = new Array();
        let arrDataSembuh = new Array();
        let arrDataMeninggal = new Array();
          for (let i=0; i<data.length; i++) {
                arrLabels[i] = data[i].attributes.date;
                arrDataPositif[i] = data[i].attributes.jumlah_positif.replace(',','');
                arrDataSembuh[i] = data[i].attributes.jumlah_sembuh.replace(',','');
                arrDataMeninggal[i] = data[i].attributes.jumlah_meninggal.replace(',','');
            }
            let arrDataPositifPerDay = arrDataPositif.map((currentValue, index, array) => {
              if(index == 0){
                return currentValue;
              }
              return currentValue - arrDataPositif[index-1];
            });
            let arrDataSembuhPerDay = arrDataSembuh.map((currentValue, index, array) => {
              if(index == 0){
                return currentValue;
              }
              return currentValue - arrDataSembuh[index-1];
            });
            let arrDataMeninggalPerDay = arrDataMeninggal.map((currentValue, index, array) => {
              if(index == 0){
                return currentValue;
              }
              return currentValue - arrDataMeninggal[index-1];
            });
           /* Chartjs (#total-coversations) */
          let ctx = document.getElementById('total-coversations').getContext('2d');
            let myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: arrLabels,
              datasets: [
                {
                  label: "Positif",
                  borderColor: '#F32013',
                  borderWidth: 4,
                  backgroundColor: 'transparent',
                  data: arrDataPositif
                },
                {
                  label: "Sembuh",
                  borderColor: '#17A2B8',
                  borderWidth: 4,
                  backgroundColor: 'transparent',
                  data: arrDataSembuh
                },
                {
                  label: "Meninggal",
                  borderColor: '#FFC107',
                  borderWidth: 4,
                  backgroundColor: 'transparent',
                  data: arrDataMeninggal
                }
              ]
            },
                options: {
              responsive: true,
              maintainAspectRatio: false,
              tooltips: {
                mode: 'index',
                titleFontSize: 12,
                titleFontColor: '#000',
                bodyFontColor: '#000',
                backgroundColor: '#fff',
                cornerRadius: 3,
                intersect: false,
              },
              legend: {
                display: true,
                labels: {
                  usePointStyle: true,
                },
              },
              scales: {
                xAxes: [{
                  ticks: {
                    fontColor: "#77778e",

                   },
                  display: true,
                  gridLines: {
                    display: true,
                    color: 'rgba(119, 119, 142, 0.2)',
                    drawBorder: false
                  },
                  scaleLabel: {
                    display: false,
                    labelString: 'Month',
                    fontColor: 'rgba(0,0,0,0.8)'
                  }
                }],
                yAxes: [{
                  ticks: {
                    fontColor: "#77778e",
                   },
                  display: true,
                  gridLines: {
                    display: false,
                    color: 'rgba(119, 119, 142, 0.2)',
                    drawBorder: false
                  },
                  scaleLabel: {
                    display: false,
                    labelString: 'sales',
                    fontColor: 'transparent'
                  }
                }]
              },
              title: {
                display: false,
                text: 'Normal Legend'
              }
            }
            });
          /* Chartjs (#total-coversations) closed */

             /* Chartjs (#total-coversations2) */
          let ctx2 = document.getElementById('total-coversations2').getContext('2d');
            let myChart2 = new Chart(ctx2, {
            type: 'line',
            data: {
              labels: arrLabels,
              datasets: [
                {
                  label: "Positif",
                  borderColor: '#F32013',
                  borderWidth: 4,
                  backgroundColor: 'transparent',
                  data: arrDataPositifPerDay
                },
                {
                  label: "Sembuh",
                  borderColor: '#17A2B8',
                  borderWidth: 4,
                  backgroundColor: 'transparent',
                  data: arrDataSembuhPerDay
                },
                {
                  label: "Meninggal",
                  borderColor: '#FFC107',
                  borderWidth: 4,
                  backgroundColor: 'transparent',
                  data: arrDataMeninggalPerDay
                }
              ]
            },
                options: {
              responsive: true,
              maintainAspectRatio: false,
              tooltips: {
                mode: 'index',
                titleFontSize: 12,
                titleFontColor: '#000',
                bodyFontColor: '#000',
                backgroundColor: '#fff',
                cornerRadius: 3,
                intersect: false,
              },
              legend: {
                display: true,
                labels: {
                  usePointStyle: true,
                },
              },
              scales: {
                xAxes: [{
                  ticks: {
                    fontColor: "#77778e",

                   },
                  display: true,
                  gridLines: {
                    display: true,
                    color: 'rgba(119, 119, 142, 0.2)',
                    drawBorder: false
                  },
                  scaleLabel: {
                    display: false,
                    labelString: 'Month',
                    fontColor: 'rgba(0,0,0,0.8)'
                  }
                }],
                yAxes: [{
                  ticks: {
                    fontColor: "#77778e",
                   },
                  display: true,
                  gridLines: {
                    display: false,
                    color: 'rgba(119, 119, 142, 0.2)',
                    drawBorder: false
                  },
                  scaleLabel: {
                    display: false,
                    labelString: 'sales',
                    fontColor: 'transparent'
                  }
                }]
              },
              title: {
                display: false,
                text: 'Normal Legend'
              }
            }
            });
          /* Chartjs (#total-coversations2) closed */
          
        },
         complete:function(data){
        // Hide image container
        $("#customloader").hide();
        $("#customloader2").hide();
       },
        error: function(jqXHR, textStatus, errorThrown){
            alert('Terjadi Kesalahan, Silahkan Reload Ulang');
        }
    });
  

    });
  