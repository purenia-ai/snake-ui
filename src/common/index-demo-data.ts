export const indexDemoGroups = [
    {
        letter: 'A',
        items: [
            { zh: '阿克苏', en: 'Aksu' },
            { zh: '安庆', en: 'Anqing' },
            { zh: '安阳', en: 'Anyang' },
            { zh: '阿拉善', en: 'Alxa' }
        ]
    },
    {
        letter: 'B',
        items: [
            { zh: '北京', en: 'Beijing' },
            { zh: '保定', en: 'Baoding' },
            { zh: '白山', en: 'Baishan' },
            { zh: '包头', en: 'Baotou' }
        ]
    },
    {
        letter: 'C',
        items: [
            { zh: '成都', en: 'Chengdu' },
            { zh: '长春', en: 'Changchun' },
            { zh: '重庆', en: 'Chongqing' },
            { zh: '沧州', en: 'Cangzhou' }
        ]
    },
    {
        letter: 'D',
        items: [
            { zh: '大连', en: 'Dalian' },
            { zh: '大理', en: 'Dali' },
            { zh: '德州', en: 'Dezhou' },
            { zh: '东莞', en: 'Dongguan' }
        ]
    }
];

export const indexDemoLetters = indexDemoGroups.map(group => group.letter);
