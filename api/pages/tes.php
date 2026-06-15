<?php




?>
<style>
   .odometer {

      font-variant-numeric: tabular-nums;

      letter-spacing: 1px;

      line-height: 1.1;

      overflow: visible !important;
   }

   /* DIGIT */
   .odometer-digit {

      padding: 0 1px;
   }

   /* ANIMASI */
   .odometer-ribbon-inner {

      transition-timing-function:
         cubic-bezier(0.19, 1, 0.22, 1) !important;
   }
</style>
<div class="">

   <h3 id="saldo" class="odometer text-3xl font-bold tracking-tight text-white">
      0
   </h3>

   <script>

      window.odometerOptions = {

         duration: 2500,

         animation: 'count',

         format: '(,ddd)',

      };

      setTimeout(() => {

         document.getElementById('saldo').innerHTML =
            <?= $saldo ?>;

      }, 300);

   </script>
</div>