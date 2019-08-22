<template>
  <div class="test">
    <UpLoad></UpLoad>
    <div id="BMap1"></div>
    <div id="BMap2"></div>
    <div class="resultContent">
        <ul>
            <li data-name="r-result" class="active">

                <p>公交<img src="images/pre_bus.png" alt="" style="width: 1.3em;left: 27%;top: 32%;"></p>
                <div class="line"></div>
            </li>
            <li data-name="r-result2">
                <img src="images/nor_car.png" alt="" style="width: 1.5em;left: 24%;top: 34%;">
                <p>驾车</p>
                <div class="line"></div>
            </li>
            <li data-name="r-result3" style="width: 33.4%">
                <img src="images/nor_walk.png" alt="" style="width: 0.8em;left: 30%;top: 33%;">
                <p>步行</p>
            </li>
        </ul>
        <div class="resultContentBlock">
            <div id="r-result" style="width: 100%;height:auto;display:none"></div>
            <div id="r-result2" style="width: 100%;height: auto;"></div>
            <div id="r-result3" style="width: 100%;height: auto;display:none"></div>
        </div>
    </div>
  </div>
</template>

<script>
import UpLoad from "@/components/UpLoad.vue";
export default {
  data() {
    return {
      pos: {
        currentLng: "",
        currentLat: "",
        proName: "",
        cityName: ""
      }
    };
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
      var point = new BMap.Point(116.331398, 31.897445);
      map.centerAndZoom(point, 12);

      var geolocation = new BMap.Geolocation();
      // 开启SDK辅助定位
      geolocation.enableSDKLocation();
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          this.pos = {
            currentLng: r.point.lng,
            currentLat: r.point.lat,
            proName: r.address.province,
            cityName: r.address.city
          };
          var opts = { type: BMAP_NAVIGATION_CONTROL_SMALL }; //放大缩小
          var pointA = new BMap.Point(r.point.lng, r.point.lat);
          var mk = new BMap.Marker(pointA);
          map.addOverlay(mk);
          map.panTo(pointA);
          //公交路线
          var transit = new BMap.TransitRoute(map, {
            renderOptions: { map: map, panel: "r-result" }
          });
          transit.search(pointA, point);
          //驾车路线
          var driving = new BMap.DrivingRoute(map, {
            renderOptions: { map: map, panel: "r-result2", autoViewport: true }
          });
          driving.search(pointA, point);
          //步行路线
          var walking = new BMap.WalkingRoute(map, {
            renderOptions: { map: map, panel: "r-result3", autoViewport: true }
          });
          walking.search(pointA, point);
          //可缩放功能
          map.addControl(new BMap.NavigationControl(opts));
          console.log("您的位置：" + r.point.lng + "," + r.point.lat);
          console.log(r, this.pos);

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







