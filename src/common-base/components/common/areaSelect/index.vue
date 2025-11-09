<template>
  <div>
    <treeselect
      :options="areaTree"
      ref="treeselect"
      v-model="selectAreas"
      :multiple="multiple"
      :disabled="disabled"
      :flatten-search-results="flattenSearchResults"
      @input="selectAreasSelect"
      :placeholder="placeholder">
  </treeselect>
  </div>
</template>

<script>
//import VTree from '../tree'
import treeselect from '@riophae/vue-treeselect'
//import '@riophae/vue-treeselect/dist/vue-treeselect.css'
let commonAreaData;
export default {
  name: 'AreaSelect',
  components: {
    treeselect
  },
  props: {
    // 节点数据
    placeholder: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    flattenSearchResults: {
      type: Boolean,
      default: true
    },
    value: {
      type: Object,
      default () {
        return {
          province: '',
          city: '',
          district: ''
        }
      }
    }
  },
  data () {
    return {
      areaTree: [],
      selectAreas: [],
      selectProvinces: [],
      selectCitys: [],
      selectDistricts: []
    }
  },
  created () {
    // eslint-disable-next-line no-undef
    commonAreaData = vue.getCommonDictionary('area');
    this.areaTree = this.utils.array2tree(commonAreaData, 'id', 'parentcode')
    this.update()
  },
  mounted () {
    this.$on('refresh', function () {
      this.update()
    })
  },
  methods: {
    selectAreasSelect () {
      this.updateSelectAreaData(this.selectAreas)
      this.$emit('change', {
        province: this.selectProvinces.join(','),
        city: this.selectCitys.join(','),
        district: this.selectDistricts.join(',')
      })
    },
    updateSelectAreaData () {
      this.selectProvinces = []
      this.selectCitys = []
      this.selectDistricts = []
      for (let i in this.selectAreas) {
        let id = this.selectAreas[i]
        if (this.isProvince(id)) {
          this.selectProvinces.push(id)
          this.selectChildrensArea(id)
        } else if (this.isCity(id)) {
          this.selectCitys.push(id)
          this.selectChildrensArea(id)
          this.selectParentArea(id)
        } else {
          this.selectDistricts.push(id)
          this.selectParentArea(id)
        }
      }
    },
    selectParentArea (id) {
      if (this.isProvince(id)) {
        return
      } else if (this.isCity(id)) {
        let province = this.getParentArea(id)
        if (Array.prototype.indexOf.call(this.selectProvinces, province.id) < 0) {
          this.selectProvinces.push(province.id)
        }
      } else {
        let city = this.getParentArea(id)
        if (Array.prototype.indexOf.call(this.selectCitys, city.id) < 0) {
          this.selectCitys.push(city.id)
        }
        this.selectParentArea(city.id)
      }
    },
    selectChildrensArea (id) {
      let childrens = this.getChildrenAreas(id)
      for (let i in childrens) {
        let child = childrens[i]
        if (this.isProvince(child.id)) {
          this.selectProvinces.push(child.id)
          // let citys = this.getChildrenAreas(child.id)
          this.selectChildrensArea(child.id)
        } else if (this.isCity(child.id)) {
          this.selectCitys.push(child.id)
          // let pistricts = this.getChildrenAreas(child.id)
          this.selectChildrensArea(child.id)
        } else {
          this.selectDistricts.push(child.id)
        }
      }
    },
    isAllChildrenSelected (id, selected) {
      let childrens = this.getChildrenAreas(id)
      for (let i in childrens) {
        let child = childrens[i]
        if (this.isCity(child.id) && !this.isAllChildrenSelected(child.id, selected)) {
          return false
        } else {
          if (Array.prototype.indexOf.call(selected, child.id) < 0) {
            return false
          }
        }
      }
      return true
    },
    isProvince (id) {
      let area = this.getAreaById(id)
      // 如果存在父级
      if (area.parentcode) {
        return false
      }
      return true
    },
    isCity (id) {
      let area = this.getAreaById(id)
      // 存在父级且父级为省
      if (area.parentcode && this.isProvince(area.parentcode)) {
        return true
      }
      return false
    },
    isPistrict (id) {
      let area = this.getAreaById(id)
      // 存在父级且父级为市
      if (area.parentcode && this.isCity(area.parentcode)) {
        return true
      }
      return false
    },
    getParentArea (id) {
      let area = this.getAreaById(id)
      let parent = null
      if (area.parentcode) {
        parent = this.getAreaById(area.parentcode)
      }
      return parent
    },
    getChildrenAreas (id) {
      return commonAreaData.filter(ad => ad.parentcode === id)
    },
    getAreaById (id) {
      let fileters = commonAreaData.filter(ad => ad.id === id)
      return fileters.length > 0 ? fileters[0] : null
    },
    isAllChilds(cid, tempList) {
      let childs = this.getChildrenAreas(cid);
      for (let i in childs) {
        if (tempList.indexOf(childs[i].id) == -1) {
          return false;
        }
      }
      return true;
    },
    update () {
      if (this.value.city && this.value.province) {
        let selectProvinces = this.value.province.split(',')
        let selectCitys = this.value.city.split(',')
        let selectDistricts = this.value.district ? this.value.district.split(',') : []
        for (let pid in selectProvinces) {
          let provinceid = selectProvinces[pid]
          let allCitys = this.getChildrenAreas(provinceid);
          let flag = true;
          for (let i in allCitys) {
            if ((!this.isAllChilds(allCitys[i].id, selectDistricts)) && (selectDistricts.length > 0)) {
              flag = false;
            }
          }
          if (!this.isAllChilds(provinceid, selectCitys)) {
            flag = false;
          }
          if (flag) {
            this.selectAreas.push(provinceid)
          }
        }
        for (let cid in selectCitys) {
          let cityid = selectCitys[cid]
          if(commonAreaData.filter(ad => ad.id === cityid).length < 1) continue
          const pId = commonAreaData.filter(ad => ad.id === cityid)[0].parentcode;
          let flag = true;
          if (this.selectAreas.indexOf(pId) > -1 || !this.isAllChilds(cityid, selectDistricts)) {
            flag = false;
          }
          if (flag) {
            this.selectAreas.push(cityid)
          }
        }
        for (let did in selectDistricts) {
          const districtId = selectDistricts[did];
          if(commonAreaData.filter(ad => ad.id === districtId).length < 1) continue
          const pId = commonAreaData.filter(ad => ad.id === districtId)[0].parentcode;
          const ppId = commonAreaData.filter(ad => ad.id === pId)[0].parentcode;
          if (this.selectAreas.indexOf(ppId) == -1 && this.selectAreas.indexOf(pId) == -1) {
            this.selectAreas.push(districtId);
          }
        }
      } else if(this.value.province && this.value.city === '' && this.value.district === '') {
        const selectProvinces = this.value.province.split(',')
        this.selectAreas = [...this.selectAreas, ...selectProvinces]
      }
    }
  }
}
</script>
