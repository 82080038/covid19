@extends('layouts.admin_template')

@section('content-header')
<div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0 text-dark">Jurnal</h1>
            </div><!-- /.col -->
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item"><a href="{{url('/')}}">Dashboard</a></li>
                <li class="breadcrumb-item active">Jurnal</li>
              </ol>
            </div><!-- /.col -->
            <div class="col-sm-12">
              @include('flash_message')
            </div>
          </div><!-- /.row -->
        </div><!-- /.container-fluid -->
      </div>
@endsection

@section('content')
<div class="container-fluid">
        <div class="row">


          <div class="col-md-6">
            <!-- general form elements -->
            <div class="card card-primary">
              <div class="card-header">
                <h3 class="card-title">Filter Jurnal</h3>
              </div>
              <!-- /.card-header -->
              <!-- form start -->
              <form onsubmit="getDataJurnal(); return false;">
                <div class="card-body">
                  <div class="row">
                    <div class="col-md-5">
                           
                    <div class="form-group">
                    <label for="tanggal_awal">Tanggal Awal</label>
                    <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="far fa-calendar-alt"></i>
                      </span>
                    </div>
                    <input type="text" class="form-control float-right" name="tanggal_awal" id="tanggal_awal" onkeydown="return false" required>
                  </div>

                  
                  </div>
                        
                
                      
                    </div>
                    <div class="col-md-2 text-center">
                           <div class="form-group">
                    
                        <label>&nbsp;</label><br>
                        <span>s/d</span>
                  
                  </div>
                    </div>
                    <div class="col-md-5">
                       <div class="form-group">
                    <label for="tanggal_akhir">Tanggal Akhir</label>
                    <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text">
                        <i class="far fa-calendar-alt"></i>
                      </span>
                    </div>
                    <input type="text" class="form-control float-right" name="tanggal_akhir" id="tanggal_akhir" onkeydown="return false" required>
                  </div>

                  
                  </div>
                      
                    </div>

                  </div>
                </div>
                <!-- /.card-body -->

                <div class="card-footer">
                  <button type="submit" class="btn btn-primary float-right">Filter</button>
                </div>
              </form>
            </div>
            <!-- /.card -->

          
        </div>
        <!-- /.row -->
          

          <div class="col-md-12" id="dtj">
            <!-- general form elements -->
            <div class="card card-primary">
              <div class="card-header">
                <h3 class="card-title" id="titlejurnal">Jurnal</h3>
              </div>
              <!-- /.card-header -->
              
                <div class="card-body" id="dtjurnal">
               
                </div>
                <!-- /.card-body -->

              
            
            </div>
            <!-- /.card -->

          
        </div>

      </div>
        <!-- /.row -->
      </div><!-- /.container-fluid -->
@endsection

@section('addscript')
<script type="text/javascript">
$( document ).ready(function() {
    

      $( "#tanggal_awal" ).datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        beforeShow: function() {
            setTimeout(function(){
                $('.ui-datepicker').css('z-index', 99999999999999);
            }, 0);
        }
      });
      $( "#tanggal_akhir" ).datepicker({
        dateFormat: 'yy-mm-dd',
        changeMonth: true,
        changeYear: true,
        beforeShow: function() {
            setTimeout(function(){
                $('.ui-datepicker').css('z-index', 99999999999999);
            }, 0);
        }
      });
  $("#dtj").hide();
      
 });
function getDataJurnal(){
  var tanggal_awal = $( "#tanggal_awal" ).val();
  var tanggal_akhir = $( "#tanggal_akhir" ).val();
    $.ajax({
        url: "{{ url('/getJurnal') }}"+"/"+tanggal_awal+"/"+tanggal_akhir,
        dataType : "json",
        success: function(data){
             $("#titlejurnal").html(data.title);
             $("#dtjurnal").html(data.dt);
             $("#dtj").show();
        },
        error : function(){
            $("#dtjurnal").html('Something Error !');
        }  
    });
}
</script>
@endsection