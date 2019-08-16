<template>
  <div class="test">
    <UpLoad></UpLoad>
    <div id="BMap1"></div>
    <div id="BMap2"></div>
  </div>
</template>

<script>
import UpLoad from "@/components/UpLoad.vue";
export default {
  data() {
    return {};
  },
  components: {
    UpLoad
  },
  mounted() {
    this.initMap1();
    this.initMap2();
    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log(pos);
      },
      err => {
        console.log(err);
      },
      {
        enableHighAcuracy: false, //位置是否精确获取
        timeout: 10000, //获取位置允许的最长时间
        maximumAge: 1000 //多久更新获取一次位置
      }
    );
  },
  methods: {
    initMap1() {
      var map = new BMap.Map("BMap1");
      var point = new BMap.Point(116.404, 39.915);
      map.centerAndZoom(point, 15);
      window.setTimeout(function() {
        map.panTo(new BMap.Point(116.409, 39.918));
      }, 2000);
    },
    initMap2() {
      var map = new BMap.Map("BMap2");
      var point = new BMap.Point(116.331398, 39.897445);
      map.centerAndZoom(point, 12);

      var geolocation = new BMap.Geolocation();
      // 开启SDK辅助定位
      geolocation.enableSDKLocation();
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
           var pointA = new BMap.Point(104.07439642533944, 30.605971996435892); 
          var mk = new BMap.Marker(pointA);
          map.addOverlay(mk);
          map.panTo(pointA);
          console.log("您的位置：" + r.point.lng + "," + r.point.lat);
          
          // var translateCallback = function(data) {
          //   if (data.status === 0) {
          //     var marker = new BMap.Marker(data.points[0]);
          //     map.addOverlay(marker);
          //     var label = new BMap.Label("转换后的百度坐标（正确）", {
          //       offset: new BMap.Size(20, -10)
          //     });
          //     marker.setLabel(label); //添加百度label
          //     map.setCenter(data.points[0]);
          //   }
          // };
          // setTimeout(function() {
          //   var convertor = new BMap.Convertor();
          //   var pointArr = [];
          //   pointArr.push(r.point);
          //   convertor.translate(pointArr, 1, 5, translateCallback);
          // }, 1000);
        } else {
          console.log("failed" + this.getStatus());
        }
      });
    }
  }
};
</script>

<style scoped lang='less'>
#BMap1,
#BMap2 {
  width: 500px;
  height: 500px;
  margin: 100px auto;
}
</style>







