const knex = require('../../../database/connection');

module.exports = async (req, res) => {
    let ret = req.ret;

    try {
        const rules = (
            await knex('discord_rules')
                .where('deleted_at', null)
                .orderBy('rule_id')
                .select('rule_id', 'version', 'draft', 'current', 'created_at')
        ).map(rule => {
            rule.draft = !!rule.draft;
            rule.current = !!rule.current;
            rule.created_at = rule.created_at.split(' ');
            rule.created_at[0] = rule.created_at[0].split('-').reverse().join('/');
            rule.created_at = rule.created_at.join(' ');

            return rule;
        });

        ret.addContent('rules', rules);
    } catch (err) {
        ret = require('../../../helpers/error-handler')(err, ret);
    }

    res.status(ret.getCode()).json(ret.generate());
};