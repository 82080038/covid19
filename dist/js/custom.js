$(function() {
const API_ROOT_LUAR = 'https://api.kawalcorona.com';
const API_ROOT_DALAM = 'https://halalmart.durioindigo.co.id/covid/api';
const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
$.ajax({
        url: API_ROOT_LUAR,
        dataType: 'json',
        success: function(data) {
            for (var i=0; i<data.length; i++) {
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
            alert('Error: ' + textStatus + ' - ' + errorThrown);
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
            alert('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });

    $.ajax({
        url: API_ROOT_LUAR+'/indonesia/provinsi/',
        dataType: 'json',
        success: function(data) {
            var tb,no=1;
            for (var i=0; i<data.length; i++) {
                tb += '<tr><td>' + no + '</td><td>' + data[i].attributes.Provinsi + '</td><td>' + data[i].attributes.Kasus_Posi + '</td><td>'+ data[i].attributes.Kasus_Semb + '</td><td>'+ data[i].attributes.Kasus_Meni + '</td></tr>';
                no++;
            }
            $('tbody').append(tb);
        },
        error: function(jqXHR, textStatus, errorThrown){
            alert('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });
    $.ajax({
        url: API_ROOT_DALAM+'/statistik',
        dataType: 'json',
        beforeSend: function(){
          // Show image container
          $("#customloader").show();
       },
        success: function(data) {
        var arrLabels = new Array();         
        var arrData = new Array();
          for (var i=0; i<data.length; i++) {
                arrLabels[i] = data[i].attributes.date;
                arrData[i] = data[i].attributes.jumlah.replace(',','');
            }
           /* Chartjs (#total-coversations) */
          var ctx = document.getElementById('total-coversations').getContext('2d');
            var myChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: arrLabels,
              datasets: [{
                label: "Positif",
                borderColor: '#F32013',
                borderWidth: 4,
                backgroundColor: 'transparent',
                data: arrData
              }]
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
                display: false,
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
          
        },
         complete:function(data){
        // Hide image container
        $("#customloader").hide();
       },
        error: function(jqXHR, textStatus, errorThrown){
            alert('Error: ' + textStatus + ' - ' + errorThrown);
        }
    });
  

    });
  