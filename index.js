const fs = require('fs');
const discord = require('discord.js');

const token = '';

const client = new discord.Client({intents: new discord.Intents(32767)});

client.on('ready', async c => {
    c.user.setPresence({activities: [{name: `r!help|${client.guilds.cache.size}servers`}], status: 'online'});
});

client.on('guildCreate', async g => {
    client.user.setPresence({activities: [{name: `r!help|${client.guilds.cache.size}servers`}], status: 'online'});
});

client.on('guildDelete', async g => {
    client.user.setPresence({activities: [{name: `r!help|${client.guilds.cache.size}servers`}], status: 'online'});
});

client.on('messageCreate', async m => {
    //ping
    if (m.content.startsWith('r!ping')) {
        m.channel.send(`pong!\n${client.ws.ping}ms`);
        return;
    }

    //register
    if (m.content.startsWith('r!register')) {
        if (!fs.existsSync(__dirname + '/saves/game.json')) {
            fs.writeFileSync(__dirname + '/saves/game.json', '{"guilds": {}}', {'encoding': 'utf-8'});
        }
        var data = JSON.parse(fs.readFileSync(__dirname + '/saves/game.json', {'encoding': 'utf-8'}));
        if (data['guilds'][m.guild.id] === undefined) {
            data['guilds'][m.guild.id] = [];
        }
        var current = {};
        if (data['guilds'][m.guild.id] === undefined) {
            data['guilds'][m.guild.id] = [];
        }
        data['guilds'][m.guild.id].forEach(item => {
            if (item['id'] === m.author.id) {
                current = item;
            }
        });
        if (current['id'] === m.author.id) {
            m.channel.send('[ERR]既に登録されています');
            return;
        }
        data['guilds'][m.guild.id].push({
            'id': m.author.id,
            'exp': 0,
            'level': 0,
            'weapon': 'none',
            'items': []
        });
        fs.writeFileSync(__dirname + '/saves/game.json', JSON.stringify(data), {'encoding': 'utf-8'});
        m.channel.send('登録が完了しました');
        return;
    }

    //reset
    if (m.content.startsWith('r!reset') && m.author.id === '805383223403348000') {
        fs.writeFileSync(__dirname + '/saves/game.json', '{"guilds": {}}', {'encoding': 'utf-8'});
        m.channel.send('リセットしました');
        return;
    }

    //st
    if (m.content.startsWith('r!st')) {
        if (m.content.split(' ').length === 1) {
            if (!fs.existsSync(__dirname + '/saves/game.json')) {
                fs.writeFileSync(__dirname + '/saves/game.json', '{"guilds": {}}', {'encoding': 'utf-8'});
            }
            var data = JSON.parse(fs.readFileSync(__dirname + '/saves/game.json', {'encoding': 'utf-8'}));
            var current = {};
            data['guilds'][m.guild.id].forEach(item => {
                if (m.author.id === item['id']) {
                    current = item;
                }
            });
            if (current['id'] === undefined) {
                m.channel.send('[ERR]データがありません');
                return;
            }
            m.channel.send({embeds: [{title: 'status', description: '```\nid    :' + m.author.id + '\nlevel :' + current['level'] + '\nexp   :' + current['exp'] + '\nweapon:' + current['weapon'] + '\n```'}]})
        }
        return;
    }

    //buttle
    if (m.content.startsWith('r!buttle')) {
        if (m.content.split(' ').length === 1) {
            if (!fs.existsSync(__dirname + '/saves/dungeons.json')) {
                fs.writeFileSync(__dirname + '/saves/dungeons.json', '{"norl": [], "season": []}');
            }
            var data = JSON.parse(fs.readFileSync(__dirname + '/saves/dungeons.json', {'encoding': 'utf-8'}));
            if (data['normal'].length === 0) {
                m.channel.send({embeds:[{
                    title: '常設ダンジョン一覧',
                    description: '常設ダンジョンの一覧です\n※期間限定ダンジョンはr!season_buttleで確認できます',
                    fields: [{
                        name: '該当なし',
                        value: '現在ダンジョンがありません',
                        inline: true
                    }]
                }]});
                return;
            }
            var embed = new discord.MessageEmbed()
            .setTitle('常設ダンジョン一覧')
            .setDescription('常設ダンジョンの一覧です\n※期間限定ダンジョンはr!season_buttleで確認できます');
            data['normal'].forEach(item => {
                embed.addField(item['name'], item['description'], true);
            });
            m.channel.send({embeds:[embed]});
            return;
        }
    }

    //season_buttle
    if (m.content.startsWith('r!season_buttle')) {
        if (m.content.split(' ').length === 1) {
            if (!fs.existsSync(__dirname + '/saves/dungeons.json')) {
                fs.writeFileSync(__dirname + '/saves/dungeons.json', '{"normal": [], "season": []}');
            }
            var data = JSON.parse(fs.readFileSync(__dirname + '/saves/dungeons.json', {'encoding': 'utf-8'}));
            if (data['season'].length === 0) {
                m.channel.send({embeds:[{
                    title: '期間限定ダンジョン一覧',
                    description: '期間限定ダンジョンの一覧です\n※常設ダンジョンはr!buttleで確認できます',
                    fields: [{
                        name: '該当なし',
                        value: '現在ダンジョンがありません',
                        inline: true
                    }]
                }]});
                return;
            }
            var embed = new discord.MessageEmbed()
            .setTitle('期間限定ダンジョン一覧')
            .setDescription('期間限定ダンジョンの一覧です\n※常設ダンジョンはr!buttleで確認できます');
            data['season'].forEach(item => {
                embed.addField(item['name'], item['description'], true);
            });
            m.channel.send({embeds:[embed]});
            return;
        }
    }

    //edit
    if (m.content.startsWith('r!edit') && m.content.split(' ').length >= 3 && m.author.id === '805383223403348000') {
        if (!fs.existsSync(__dirname + '/saves/' + m.content.split(' ')[1] + '.json')) {
            m.channel.send('[ERR]ファイルが見つかりませんでした');
            return;
        }
        var content = '';
        for (let i = 0;i < m.content.split(' ').length;i++) {
            if (i === m.content.split(' ').length-1) {
                content += m.content.split(' ')[i];
            } else if (i !== 0 && i !== 1) {
                content += m.content.split(' ')[i] + ' ';
            }
        }
        fs.writeFileSync(__dirname + '/saves/' + m.content.split(' ')[1] + '.json', content, {'encoding':'utf-8'});
        m.channel.send('書き込みました');
        return;
    }

    //add_dungeon
    if (m.content.startsWith('r!add_dungeon') && m.author.id === '805383223403348000' && m.content.split(' ').length >= 3) {
        if (!fs.existsSync(__dirname + '/saves/dungeons.json')) {
            fs.writeFileSync(__dirname + '/saves/dungeons.json', '{"normal":[],"season":[]}', {'encoding':'utf-8'});
        }
        var data = JSON.parse(fs.readFileSync(__dirname + '/saves/dungeons.json', {'encoding':'utf-8'}));
        var description = '';
        for (let i = 0;i < m.content.split(' ').length;i++) {
            if (i === m.content.split(' ').length-1) {
                description += m.content.split(' ')[i];
            } else if (i !== 0 && i !== 1) {0
                description += m.content.split(' ')[i] + ' ';
            }
        }
        data['normal'].push({'name':m.content.split(' ')[1], 'description':description});
        fs.writeFileSync(__dirname + '/saves/dungeons.json', JSON.stringify(data), {'encoding':'utf-8'});
        m.channel.send('追加しました');
        return;
    }

    //remove_dungeon
    if (m.content.startsWith('r!remove_dungeon') && m.author.id === '805383223403348000' && m.content.split(' ').length === 2) {
        if (!fs.existsSync(__dirname + '/saves/dungeons.json')) {
            fs.writeFileSync(__dirname + '/saves/dungeons.json', '{"normal":[],"season":[]}', {'encoding':'utf-8'});
        }
        var data = JSON.parse(fs.readFileSync(__dirname + '/saves/dungeons.json', {'encoding':'utf-8'}));
        var new_list = []
        data['normal'].forEach(item => {
            if (item['name'] !== m.content.split(' ')[1]) {
                new_list.push(item);
            }
        });
        data['normal'] = new_list;
        fs.writeFileSync(__dirname + '/saves/dungeons.json', JSON.stringify(data), {'encoding':'utf-8'});
        m.channel.send('削除しました');
        return;
    }

    //add_season_dungeon
    if (m.content.startsWith('r!add_season_dungeon') && m.author.id === '805383223403348000' && m.content.split(' ').length >= 3) {
        if (!fs.existsSync(__dirname + '/saves/dungeons.json')) {
            fs.writeFileSync(__dirname + '/saves/dungeons.json', '{"normal":[],"season":[]}', {'encoding':'utf-8'});
        }
        var data = JSON.parse(fs.readFileSync(__dirname + '/saves/dungeons.json', {'encoding':'utf-8'}));
        var description = '';
        for (let i = 0;i < m.content.split(' ').length;i++) {
            if (i === m.content.split(' ').length-1) {
                description += m.content.split(' ')[i];
            } else if (i !== 0 && i !== 1) {0
                description += m.content.split(' ')[i] + ' ';
            }
        }
        data['season'].push({'name':m.content.split(' ')[1], 'description':description});
        fs.writeFileSync(__dirname + '/saves/dungeons.json', JSON.stringify(data), {'encoding':'utf-8'});
        m.channel.send('追加しました');
        return;
    }

    //remove_season_dungeon
    if (m.content.startsWith('r!remove_season_dungeon') && m.author.id === '805383223403348000' && m.content.split(' ').length === 2) {
        if (!fs.existsSync(__dirname + '/saves/dungeons.json')) {
            fs.writeFileSync(__dirname + '/saves/dungeons.json', '{"normal":[],"season":[]}', {'encoding':'utf-8'});
        }
        var data = JSON.parse(fs.readFileSync(__dirname + '/saves/dungeons.json', {'encoding':'utf-8'}));
        var new_list = []
        data['season'].forEach(item => {
            if (item['name'] !== m.content.split(' ')[1]) {
                new_list.push(item);
            }
        });
        data['season'] = new_list;
        fs.writeFileSync(__dirname + '/saves/dungeons.json', JSON.stringify(data), {'encoding':'utf-8'});
        m.channel.send('削除しました');
        return;
    }

    //help
    if (m.content.startsWith('r!help')) {
        if (m.content.split(' ').length === 1) {
            m.channel.send({
                content: 'Help',
                embeds: [{
                    title: 'Help',
                    fields: [
                        {
                            name: 'r!ping',
                            value: 'BOTのpingを表示します。',
                            inline: true
                        },
                        {
                            name: 'r!register',
                            value: 'RPGにデータを登録します。',
                            inline: true
                        },
                        {
                            name: 'r!st',
                            value: 'RPGに関係するデータを表示します',
                            inline: true
                        },
                        {
                            name: 'r!buttle',
                            value: '常設ダンジョンの一覧を表示します',
                            inline: true
                        },
                        {
                            name: 'r!season_buttle',
                            value: '期間限定ダンジョンの一覧を表示します',
                            inline: true
                        }
                    ]
                }]
            });
            return;
        }
        if (m.content.split(' ').length === 2) {
            if (m.content.split(' ')[1] === 'ping') {
                m.channel.send({
                    content: 'Help(ping)',
                    embeds: [{
                        title: 'Help(ping)',
                        fields: [
                            {
                                name: '概要',
                                value: 'BOTのpingを表示します。'
                            }
                        ]
                    }]
                });
                return;
            }
            if (m.content.split(' ')[1] === 'register') {
                m.channel.send({
                    content: 'Help(register)',
                    embeds: [{
                        title: 'Help(register)',
                        fields: [
                            {
                                name: 'r!register',
                                value: 'RPGにデータを登録します。',
                                inline: true
                            }
                        ]
                    }]
                });
                return;
            }
            if (m.content.split(' ')[1] === 'st') {
                m.channel.send({
                    content: 'Help(st)',
                    embeds: [{
                        title: 'Help(st)',
                        fields: [
                            {
                                name: 'r!st',
                                value: 'RPGに関係するデータを表示します',
                                inline: true
                            }
                        ]
                    }]
                });
                return;
            }
            if (m.content.split(' ')[1] === 'buttle') {
                m.channel.send({
                    content: 'Help(buttle)',
                    embeds: [{
                        fields: [
                            {
                                name: 'r!buttle',
                                value: '常設ダンジョンの一覧を表示します',
                                inline: true
                            }
                        ]
                    }]
                });
                return;
            }
            if (m.content.split(' ')[1] === 'season_buttle') {
                m.channel.send({
                    content: 'Help(season_buttle)',
                    embeds: [{
                        fields: [
                            {
                                name: 'r!season_buttle',
                                value: '期間限定ダンジョンの一覧を表示します',
                                inline: true
                            }
                        ]
                    }]
                });
                return;
            }
        }
    }

    //隠しコマンド
    //ばんごはん
    if (m.content === '今日のばんごはんは？') {
        var dinner = [
            'は、は、はんばああああああああああぐ',
            'らーめん。',
            'oh, YAKINIKU',
            'まぁぼぉはるさめ。',
            'ジョジョ苑'
        ]
        m.channel.send(dinner[Math.floor(Math.random()*(dinner.length-1))]);
        return;
    }

    //exp
    if (!fs.existsSync(__dirname + '/saves/game.json')) {
        fs.writeFileSync(__dirname + '/saves/game.json', '{"guilds": {}}', {'encoding': 'utf-8'});
    }
    var data = JSON.parse(fs.readFileSync(__dirname + '/saves/game.json', {'encoding': 'utf-8'}));
    var current = {};
    if (data['guilds'][m.guild.id] === undefined) {
        data['guilds'][m.guild.id] = [];
    }
    data['guilds'][m.guild.id].forEach(item => {
        if (item['id'] === m.author.id) {
            current = item;
        }
    });
    if (current !== {}) {
        current['exp'] += 1;
        var next_exp = 0;
        for (let i = 0;i < current['level']+1;i++) {
            next_exp += (i+1)*10;
        }
        if (current['exp'] === next_exp) {
            m.channel.send('<@' + m.author.id + '>\nレベルアップしました！(' + current['level'] + '=>' + String(current['level']+1) + ')');
            current['level'] += 1;
        }
        data['guilds'][m.guild.id].forEach(item => {
            if (item['id'] === current['id']) {
                data['guilds'][m.guild.id][data['guilds'][m.guild.id].indexOf(item)] = current;
            }
        });
        fs.writeFileSync(__dirname + '/saves/game.json', JSON.stringify(data), {'encoding': 'utf-8'});
    }
});

client.login(token);