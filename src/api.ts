import express from 'express';
import { addGroup, addLinkToGroup, removeGroup, removeLinkFromGroup, showGroups, showLinksByLabelOrGroup, showLinksInGroup } from './link';

const AppRouter = express.Router()

AppRouter.get('/group', async (req, res) => {
    try {
        const response = await showGroups();
        if (response && response.error) return res.status(500).send(response)
        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'unexpected error';
        return res.status(500).send({ error: message })
    }
})

AppRouter.post('/group', async (req, res) => {
    try {
        const { groupName } = req.body;
        if (!groupName) return res.status(400).send("Bad data, no group name")
        const response = await addGroup(groupName);
        if (response && response.error) return res.status(500).send(response)
        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'unexpected error';
        return res.status(500).send({ error: message })
    }
})

AppRouter.delete('/group/:groupName', async (req, res) => {
    try {
        const { groupName } = req.params as { groupName: string };
        if (!groupName) return res.status(400).send("Bad data, no group name")
        const response = await removeGroup(groupName);
        if (response && response.error) return res.status(500).send(response)
        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'unexpected error';
        return res.status(500).send({ error: message })
    }
})

AppRouter.get('/group/:groupName/link', async (req, res) => {
    try {
        const { groupName } = req.params;
        if (!groupName) return res.status(400).send("Bad data, no group name")
        const response = await showLinksInGroup(groupName);
        if (response && response.error) return res.status(500).send(response)
        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'unexpected error';
        return res.status(500).send({ error: message })
    }
})

AppRouter.get('/link', async (req, res) => {
    try {
        const { label, group } = req.query;
        if (!label) return res.status(400).send("Bad data, no label provided")
        const response = await showLinksByLabelOrGroup(label.toString(), group?.toString());
        if (response && response.error) return res.status(500).send(response)
        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'unexpected error';
        return res.status(500).send({ error: message })
    }
})
AppRouter.post('/link', async (req, res) => {
    try {
        const data = req.body;

        let missingValues = Object.keys(data).filter(item => {
            const flag = ['group', 'label', 'link'].includes(item)
            if (!flag) return item;
        })

        if (missingValues.length > 0) return res.status(400).send({
            message: 'bad request, missing values',
            fields: missingValues
        })

        const response = await addLinkToGroup(data.group, { label: data.label, link: data.link });
        if (response && response.error) return res.status(500).send(response)
        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'unexpected error';
        return res.status(500).send({ error: message })
    }
})
  
AppRouter.delete('/link/:group/:label', async (req, res) => {
    try {
        const { group, label } = req.params as { group: string, label: string }
        const response = await removeLinkFromGroup(group, label);
        if (response && response.error) return res.status(500).send(response)
        return res.status(200).send(response);
    } catch (err) {
        console.error(err);
        const message = err instanceof Error ? err.message : 'unexpected error';
        return res.status(500).send({ error: message })
    }
})

export default AppRouter;