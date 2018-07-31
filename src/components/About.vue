<template>
  <div class='about'>
    <div class='background absolute' @click.prevent='close'></div>
    <div class='content'>
      <h3>Map Print <a class='close bold' href='#' @click.prevent='close'>close</a></h3>
      <p>
        This website is allows you to create personalized mugs from your travels.
      </p>

      <p>Align the boundaries of the map that you'd like to see on a mug and click "Start".
        Every single road is downloaded and rendered on a canvas.</p>
      <p> After that you can print the map on a mug with Zazzle. </p>
      <p>The roads/buildings are downloaded from amazing <a href='http://www.openstreetmap.org/' target='_blank' class='highlighted'>OpenStreetMap</a>.
      </p>
      <ul>
        <li>
          <a href='https://github.com/anvaka/map-print' class='highlighted'>Learn more </a> about this project on GitHub
        </li><li>
        Stay tuned for updates on <a href='https://twitter.com/anvaka' class='highlighted'>Twitter.</a>
        </li>
      </ul>
      <p>With passion,<br/> Anvaka</p>
      <a href='#' @click.prevent='close' class='large-close bold'>
        close
      </a>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    this.closeHandler = (e) => {
      if (e.keyCode === 27) {
        e.preventDefault();
        this.close();
      }
    }
    document.addEventListener('keyup', this.closeHandler);
  },
  beforeDestroy() {
    document.removeEventListener('keyup', this.closeHandler);
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style lang='stylus'>
.about {
  z-index: 4;
  position: fixed;
  overflow-y: auto;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .close {
    position: absolute;
    right: 15px;
    font-size: 12px;
  }
  .large-close {
    width: 100%;
    height: 32px;
    display: block;
    text-align: center;
  }
  .content {
    position: absolute;
    background-color: #fff;
    width: 400px;
    padding: 14px;
    h3 {
      margin: 0;
      font-weight: normal;
    }
  }
}
.background {
  position: absolute;
  background-color: rgba(99, 99, 99, 0.8);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
@media (max-width: 800px) {
  .about {
    justify-content: initial;
  }
  .about .content {
    width: 100%;
    border: none;
  }
}
</style>