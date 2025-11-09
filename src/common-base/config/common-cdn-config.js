/*
 * @Date: 2022-09-21 02:36:29
 * @LastEditors: songjunlong songjunlong@lonch.com.cn
 * @LastEditTime: 2024-05-28 17:23:51
 * @FilePath: \lonch-rxv-fe\src\common-base\config\common-cdn-config.js
 * @Description: 
 */
/**
 * 全局CDN配置
 */
const shaMap = {
  '/areaData.js': 'g5m+znEWvIs/F1eqVX86QwNTWHAh7+JPfze8HnKhUh1sDHPu9e0MAwHClfDeVUF7',
  '/axios@0.19.2.js': 'zkUJpkowu9WXCfNtvAAw0c8/w60ncQ9MV7OdehI1ShwjIGJu7PDRHVfBoYP6uLuR',
  '/axios@0.21.0.js': 'SFik73j8UXBBNnmFnwZyDR2LKolwB9T6Ro7h9GSb0w11y+X19vymMelYhMz0Goe4',
  '/canvas.js': 'R2nvoWeHV5a9syTKCTndvbP9HQnCqyx5SqZfD9oxHy7edHE9gxnLPwXBR70GSENz',
  '/decPorsion.js': 'X0IBr0T/DK1qRB1iuVRFHBTuysBYnchxiY/NiMT2+bsB0N7GgHwObXKOZkPKKB8J',
  '/dictionarys.js': 'FhmIlSphoDsm7oe0g39pBKRK8ecg3TcwXyIVW3NlKIqn+j3jPTobO9zlhUXVfrtV',
  '/element-ui@2.13.0.js': 'ytFAEkOwTfw3jn6udeexIJs8mdlidI5b6KAtXFK6aV2GqjVODXh7Sax3x070SoPQ',
  '/element-ui@2.13.0-base.js': 'KwUhx5M6a1br5OfxVc3me3sVPqVq5d89x2TNIpsIn+4gfZfxtxSd3t2rNChiaZD1',
  '/fastClick.js': 'qSrEYLMHSuUya7HioxgwmVKxoqyVbT2Xmu87cJyVwFm1oq4M6Tz5lcdiFrOrS93l',
  '/fingerprintjs.v3.3.3.min.js': 'Pb7MPZ3IiunChNMUkLQlXVWO9cCYiUHQg8aFatFEvlYc15B9KnEgJAA47bYTuuD6',
  '/global.js': 'OLBgp1GsljhM2TJ+sbHjaiH9txEUvgdDTAzHv2P24donTt6/529l+9Ua0vFImLlb',
  '/index.js': 'mN/JXTDlcmCkauO2TRJJ7ZO6GXduRdCbFo6TZzQVvfOuzJCV633ErQIEDImCwUgq',
  '/jquery-1.11.2.min.js': 'T0OWz0dvfKa0lVcdS1AKv4tcbDtBxbOOx1xMS/Jx1eOW432MBC2+K8uBCjMTBZlo',
  '/jqueryui-1.11.4.js': 'aET5tnqKp8ON9i0ZrgnwyyyRYe3bCSzsiulnoY9GGxax5asdU57F7uIXC3eZqWrK',
  '/jqueryui-touch-punch-0.2.3.js': 'i7Jwo753S/JTk7sUZufRM7jorhfbk0iJHPaV0MI0JOzJbTpDYcw7Peh46aj9dqTE',
  '/jweixin-1.2.0.js': '9agcKkPIb3gXexcuoTOquZibdup65cTXfsB63uqQXl4DZV/lVLZb/KFsFBHS/OqS',
  '/jweixin-1.3.2.js': 'X37YKISn2MTfOniT52mdKC+7NGMNXY0oA3rUibPFfPfnXAayBhDCXUJl0bovYpvt',
  '/jweixin-1.6.0.js': 'tQb2LLCCkWoQiDlvMZQIFHKO3s6CH1u9mNHPaD5+5EQg8Fr0ohyc7lSmpXzCHRt4',
  '/pivottable-2.23.0.js': 'PIvfSr+cEYGgNaTGuT23Y4xVZE5wJVx8TN14wwUPuxD5OaQdNiCfS4PL/f/MBQA9',
  '/pivottable-2.23.0.zh.js': 'mHZlAs+Vgx88eNOGyNLHMBeiXozWDTMpkp+QDOOa/EZ4LSEgvvu74/zzmzNaF4bK',
  '/pivottable-export_renderers-2.23.0.js': '5JorCh6jyyPHcFXdqlLd7XPk6aqjy3FGUiheTIeYx1aa5+Ixw9ClyQfxRDHJfTed',
  '/SIPml-api.js': 'yXEmq/VafD2zF7QfN2d4aDoiMxiwtWTCyjd3qh7TtFO2pgAc0WdfpGRkbG/3XANw',
  '/vue@2.6.11.js': 'TvMB74vantHAw0Fe3fLp8x53jSJl2p80dhHBsx8LmkcTFeVTXcfPFGZ4fsJ+VwU8',
  '/vue-router@3.1.6.js': 'k0p2wkSy/BUaG350RZcQfzqaYaLDzxkNS3nvrEk2BvqSwrrcwI5eQ0SjUXJaoEeo',
  '/vue-router@3.4.9.js': 'FoUmEaZS2Hr+Anhe2yPn3XYaNVNrOQil/BhtnE6q7qIqED7fYqD4LIouM6Uqjw7d',
  '/workbenchSdk.min.js': 'dg77FsksZ4jsCiBBa6q1Eai7IoZfW59klOITDM4oK+LnyGqUvUlGgVfkhQ8LDfiF',
  '/element-ui@2.13.0.css': 'EryhS6WFx0S8QIlXvQ2wwrJJv58Xhq32IQJOLWsY0QkgssbmPi5RwD8qInG1JlpL',
  '/element-ui-2.13.0.css': 'Th/EDaubozXhOOeTya7qTvFc8zhs9k2tAqqLY9yhCVppvugya7v3XmVEpKFS/WtB',
  '/global.css': 'iks31YOzKaGnIHCysbXMWDjxpFS7MtdI79KR6ED99yIhfGl0YO0cpTtvliXnVGVe',
  '/pivottable-2.23.0.css': 'rr1MC3uPwGILxiQ3ABRE6eHn3rcvlvjEpV6kNKTsdDjGeyy7/8J8bT4Vz3YMT5Lk',
  '/vue-treeselect.min-v0.4.0.css': 'NKe9nMDYtVTTJIQPNkfY3GS8BN7ex7O/XtpjkYk/y0yDiS2zkKZMMlvRCpMudEsi',
  '/workbench-sdk-1.0.8-main.min.css': 'jJxB4j2B2+sVj5NEKChP5pI0PazwewiRhBbAfzVFG/Nw/nW5zdiSsqvrSyMx8tqU'
}
const commonCDNConfig = {
  dev: {
    cdn: {
      basePath: 'https://resources.lonch.com.cn/test-common-library',
      commonDataPath:'https://resources.lonch.com.cn/test-common-data-config',
      shaMap: shaMap
    },
    app: {
      basePath: '../../common-library',
      commonDataPath:'https://resources.lonch.com.cn/test-common-data-config',
      shaMap: shaMap
    }
  },
  test: {
    cdn: {
      basePath: 'https://resources.lonch.com.cn/test-common-library',
      commonDataPath:'https://resources.lonch.com.cn/test-common-data-config',
      shaMap: shaMap
    },
    app: {
      basePath: '../../common-library',
      commonDataPath:'https://resources.lonch.com.cn/test-common-data-config',
      shaMap: shaMap
    }
  },
  production: {
    cdn: {
      basePath: 'https://resources.lonch.com.cn/common-library',
      commonDataPath:'https://resources.lonch.com.cn/common-data-config',
      shaMap: shaMap
    },
    app: {
      basePath: '../../common-library',
      commonDataPath:'https://resources.lonch.com.cn/common-data-config'
    }
  }
};

module.exports = commonCDNConfig[process.env.VUE_APP_MODE];
