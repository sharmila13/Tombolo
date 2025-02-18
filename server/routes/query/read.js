const express = require('express');
const router = express.Router();
let mongoose = require('mongoose');
var models  = require('../../models');
let Query = models.query;
let QueryField = models.query_field;
router.post('/saveQuery', (req, res) => {
    console.log("[saveQuery] - Get file list for app_id = " + req.body._id + " isNewQuery: "+req.body.isNewQuery);
    var query_id, fieldsToUpdate={}, applicationId=req.body.basic.applicationId;
    try {
        Query.findOrCreate(
            {where: {title: req.body.basic.title, application_id:applicationId},
            defaults: req.body.basic

        }).then(function(result) {
            query_id = result[0].id;
            fieldsToUpdate = {"query_id":query_id, "application_id":applicationId};
            if(!result[1]) {
                Query.update(req.body.basic, {where:{application_id:applicationId, title:req.body.basic.title}}).then(function(result){})
            }

            var queryFieldToSave = updateCommonData(req.body.fields, fieldsToUpdate);
            return QueryField.bulkCreate(
                queryFieldToSave, {updateOnDuplicate: ["field_type", "field", "type"]}
            )
        }).then(function(query) {
            console.log("saving query");
            res.json({"result":"success"});
        }), function(err) {
            return res.status(500).send(err);
        }
    } catch (err) {
        console.log('err', err);
    }
});

router.get('/query_list', (req, res) => {
    console.log("[query list/read.js] - Get query list for app_id = " + req.query.app_id);
    try {
        Query.findAll({where:{"application_id":req.query.app_id}}).then(function(queries) {
            res.json(queries);
        })
        .catch(function(err) {
            console.log(err);
        });
    } catch (err) {
        console.log('err', err);
    }
});


router.get('/query_details', (req, res) => {
    console.log("[query list/read.js] - Get query list for app_id = " + req.query.app_id + " query_id: "+req.query.query_id);
    try {
        Query.findOne({where:{"application_id":req.query.app_id, "id":req.query.query_id}, include: [QueryField]}).then(function(query) {
            res.json(query);
        })
        .catch(function(err) {
            console.log(err);
        });
    } catch (err) {
        console.log('err', err);
    }
});

router.post('/delete', (req, res) => {
    console.log("[delete/read.js] - delete query = " + req.body.queryId + " appId: "+req.body.application_id);
    try {
        Query.destroy(
            {where:{"id": req.body.queryId, "application_id":req.body.application_id}}
        ).then(function(deleted) {
            QueryField.destroy(
                {where:{ query_id: req.body.queryId }}
            ).then(function(layoutDeleted) {
                res.json({"result":"success"});
            });
        }).catch(function(err) {
            console.log(err);
        });
    } catch (err) {
        console.log('err', err);
    }
});

function updateCommonData(objArray, fields) {
    Object.keys(fields).forEach(function (key, index) {
        objArray.forEach(function(obj) {
            obj[key] = fields[key];
        });
    });
    return objArray;
}


module.exports = router;