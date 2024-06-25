"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var bodyParser = require('body-parser');
var client_1 = require("@prisma/client");
var app = express();
var prisma = new client_1.PrismaClient();
var port = 3000;
var adminSecretKey = "admin123";
var userSecretKey = "user123";
app.use(cors());
app.use(bodyParser.json());
function authenticateAdmin(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, adminAuthenticated;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                    return [4 /*yield*/, jwt.verify(token, adminSecretKey)];
                case 1:
                    adminAuthenticated = _b.sent();
                    if (adminAuthenticated) {
                        next();
                    }
                    else {
                        res.status(403).json({ message: "admin authentication failed" });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function authenticateUser(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var token, userAuthenticated, user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                    return [4 /*yield*/, jwt.verify(token, userSecretKey)];
                case 1:
                    userAuthenticated = _b.sent();
                    if (!userAuthenticated) return [3 /*break*/, 3];
                    return [4 /*yield*/, prisma.user.findUnique({
                            where: {
                                email: userAuthenticated
                            }
                        })];
                case 2:
                    user = _b.sent();
                    if (user) {
                        req.userId = user.id;
                        next();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    res.status(403).json({ message: "user authentication failed" });
                    _b.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
app.post('/admin/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminPresent, adminAdded, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.admin.findUnique({
                    where: {
                        email: req.body.email
                    }
                })];
            case 1:
                adminPresent = _a.sent();
                if (!adminPresent) return [3 /*break*/, 2];
                res.status(403).json({ message: "admin already present" });
                return [3 /*break*/, 6];
            case 2: return [4 /*yield*/, prisma.admin.create({
                    data: {
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    }
                })];
            case 3:
                adminAdded = _a.sent();
                if (!adminAdded) return [3 /*break*/, 5];
                return [4 /*yield*/, jwt.sign(req.body.email, adminSecretKey)];
            case 4:
                token = _a.sent();
                res.status(201).json({ message: "admin created successfully", adminAdded: adminAdded, token: token });
                return [3 /*break*/, 6];
            case 5:
                res.status(403).json({ message: "admin signup failed" });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post('/admin/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var adminPresent, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.admin.findUnique({
                    where: {
                        email: req.body.email,
                        password: req.body.password
                    }
                })];
            case 1:
                adminPresent = _a.sent();
                if (!adminPresent) return [3 /*break*/, 3];
                return [4 /*yield*/, jwt.sign(req.body.email, adminSecretKey)];
            case 2:
                token = _a.sent();
                res.status(200).json({ message: "admin logged in successfully", token: token });
                return [3 /*break*/, 4];
            case 3:
                res.status(403).json({ message: "admin login falied" });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/admin/addExercise', authenticateAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var exerciseAdded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.exercise.create({
                    data: {
                        name: req.body.name
                    }
                })];
            case 1:
                exerciseAdded = _a.sent();
                if (exerciseAdded) {
                    res.status(201).json({ message: "exercise added", exerciseAdded: exerciseAdded });
                }
                else {
                    res.status(403).json({ message: "failed to add exercise" });
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/admin/getAllExercises', authenticateAdmin, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allExercises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.exercise.findMany()];
            case 1:
                allExercises = _a.sent();
                res.status(200).json(allExercises);
                return [2 /*return*/];
        }
    });
}); });
app.post('/user/signup', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userPresent, userAdded, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findUnique({
                    where: {
                        email: req.body.email
                    }
                })];
            case 1:
                userPresent = _a.sent();
                if (!userPresent) return [3 /*break*/, 2];
                res.status(403).json({ mesaage: "user adready present" });
                return [3 /*break*/, 6];
            case 2: return [4 /*yield*/, prisma.user.create({
                    data: req.body
                })];
            case 3:
                userAdded = _a.sent();
                if (!userAdded) return [3 /*break*/, 5];
                return [4 /*yield*/, jwt.sign(req.body.email, userSecretKey)];
            case 4:
                token = _a.sent();
                res.status(201).json({ message: "user successfully created", token: token });
                return [3 /*break*/, 6];
            case 5:
                res.status(403).json({ message: "user signup failed" });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
app.post('/user/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userPresent, token;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findUnique({
                    where: {
                        email: req.body.email,
                        password: req.body.password
                    }
                })];
            case 1:
                userPresent = _a.sent();
                console.log(userPresent);
                if (!userPresent) return [3 /*break*/, 3];
                return [4 /*yield*/, jwt.sign(req.body.email, userSecretKey)];
            case 2:
                token = _a.sent();
                res.status(200).json({ message: "user successfully logged in", userPresent: userPresent, token: token });
                return [3 /*break*/, 4];
            case 3:
                res.status(403).json({ message: "user login failed" });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post('/user/auth', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, userAuthenticated;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                return [4 /*yield*/, jwt.verify(token, userSecretKey)];
            case 1:
                userAuthenticated = _b.sent();
                if (userAuthenticated) {
                    res.status(200).send("authenticated");
                }
                else {
                    res.status(403).json({ message: "user authentication failed" });
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/user/getAllExercises', authenticateUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allExercises;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.exercise.findMany()];
            case 1:
                allExercises = _a.sent();
                res.status(200).json(allExercises);
                return [2 /*return*/];
        }
    });
}); });
app.post('/user/addRoutine', authenticateUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var routineAdded, i, workoutAdded, j, setAdded;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.routine.create({
                    data: {
                        name: req.body.name,
                        userId: req.userId
                    }
                })];
            case 1:
                routineAdded = _a.sent();
                if (!routineAdded) return [3 /*break*/, 9];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < req.body.workout.length)) return [3 /*break*/, 8];
                return [4 /*yield*/, prisma.workout.create({
                        data: {
                            name: req.body.workout[i].name,
                            routineId: routineAdded.id
                        }
                    })];
            case 3:
                workoutAdded = _a.sent();
                if (!workoutAdded) return [3 /*break*/, 7];
                j = 0;
                _a.label = 4;
            case 4:
                if (!(j < req.body.workout[i].set.length)) return [3 /*break*/, 7];
                return [4 /*yield*/, prisma.set.create({
                        data: {
                            weight: req.body.workout[i].set[j].weight,
                            count: req.body.workout[i].set[j].count,
                            workoutId: workoutAdded.id
                        }
                    })];
            case 5:
                setAdded = _a.sent();
                _a.label = 6;
            case 6:
                j++;
                return [3 /*break*/, 4];
            case 7:
                i++;
                return [3 /*break*/, 2];
            case 8:
                res.status(201).json({ message: "routine successfully created", routineAdded: routineAdded });
                return [3 /*break*/, 10];
            case 9:
                res.status(403).json({ message: "add routine failed" });
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
app.put('/user/updateRoutine/:id', authenticateUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var routineUpdated, workoutArray, i, workoutPresent, a, workoutUpdated, setArray, j, setPresent, setUpdated, newSet, allSets, i_1, setDelete, workoutAdded, j, setAdded, allWorkoutsId, i, deleteWorkout;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.routine.update({
                    where: {
                        id: +req.params.id
                    },
                    data: {
                        name: req.body.name
                    }
                })];
            case 1:
                routineUpdated = _a.sent();
                if (!routineUpdated) return [3 /*break*/, 30];
                workoutArray = [];
                i = 0;
                _a.label = 2;
            case 2:
                if (!(i < req.body.workout.length)) return [3 /*break*/, 23];
                return [4 /*yield*/, prisma.workout.findUnique({
                        where: {
                            id: req.body.workout[i].id
                        }
                    })];
            case 3:
                workoutPresent = _a.sent();
                if (!workoutPresent) return [3 /*break*/, 17];
                a = 9;
                workoutArray.push(workoutPresent.id);
                return [4 /*yield*/, prisma.workout.update({
                        where: {
                            id: req.body.workout[i].id,
                            routineId: routineUpdated.id
                        },
                        data: {
                            name: req.body.workout[i].name
                        }
                    })];
            case 4:
                workoutUpdated = _a.sent();
                if (!workoutUpdated) return [3 /*break*/, 16];
                setArray = [];
                j = 0;
                _a.label = 5;
            case 5:
                if (!(j < req.body.workout[i].set.length)) return [3 /*break*/, 11];
                return [4 /*yield*/, prisma.set.findUnique({
                        where: {
                            id: req.body.workout[i].set[j].id
                        }
                    })];
            case 6:
                setPresent = _a.sent();
                if (!setPresent) return [3 /*break*/, 8];
                setArray.push(setPresent.id);
                return [4 /*yield*/, prisma.set.update({
                        where: {
                            id: req.body.workout[i].set[j].id,
                            workoutId: req.body.workout[i].id
                        },
                        data: {
                            weight: req.body.workout[i].set[j].weight,
                            count: req.body.workout[i].set[j].count
                        }
                    })];
            case 7:
                setUpdated = _a.sent();
                return [3 /*break*/, 10];
            case 8: return [4 /*yield*/, prisma.set.create({
                    data: {
                        weight: req.body.workout[i].set[j].weight,
                        count: req.body.workout[i].set[j].count,
                        workoutId: req.body.workout[i].id
                    }
                })];
            case 9:
                newSet = _a.sent();
                setArray.push(newSet.id);
                _a.label = 10;
            case 10:
                j++;
                return [3 /*break*/, 5];
            case 11: return [4 /*yield*/, prisma.set.findMany({
                    where: {
                        workoutId: workoutUpdated.id
                    },
                    select: {
                        id: true
                    }
                })];
            case 12:
                allSets = _a.sent();
                i_1 = 0;
                _a.label = 13;
            case 13:
                if (!(i_1 < allSets.length)) return [3 /*break*/, 16];
                if (!!setArray.includes(allSets[i_1].id)) return [3 /*break*/, 15];
                return [4 /*yield*/, prisma.set.delete({
                        where: {
                            id: allSets[i_1].id,
                            workoutId: workoutUpdated.id
                        }
                    })];
            case 14:
                setDelete = _a.sent();
                _a.label = 15;
            case 15:
                i_1++;
                return [3 /*break*/, 13];
            case 16: return [3 /*break*/, 22];
            case 17: return [4 /*yield*/, prisma.workout.create({
                    data: {
                        name: req.body.workout[i].name,
                        routineId: +req.params.id
                    }
                })];
            case 18:
                workoutAdded = _a.sent();
                workoutArray.push(workoutAdded.id);
                if (!workoutAdded) return [3 /*break*/, 22];
                j = 0;
                _a.label = 19;
            case 19:
                if (!(j < req.body.workout[i].set.length)) return [3 /*break*/, 22];
                return [4 /*yield*/, prisma.set.create({
                        data: {
                            weight: req.body.workout[i].set[j].weight,
                            count: req.body.workout[i].set[j].count,
                            workoutId: workoutAdded.id
                        }
                    })];
            case 20:
                setAdded = _a.sent();
                _a.label = 21;
            case 21:
                j++;
                return [3 /*break*/, 19];
            case 22:
                i++;
                return [3 /*break*/, 2];
            case 23: return [4 /*yield*/, prisma.workout.findMany({
                    where: {
                        routineId: +req.params.id
                    },
                    select: {
                        id: true
                    }
                })];
            case 24:
                allWorkoutsId = _a.sent();
                console.log(allWorkoutsId);
                i = 0;
                _a.label = 25;
            case 25:
                if (!(i < allWorkoutsId.length)) return [3 /*break*/, 29];
                if (!workoutArray.includes(allWorkoutsId[i].id)) return [3 /*break*/, 26];
                return [3 /*break*/, 28];
            case 26:
                console.log("reached");
                return [4 /*yield*/, prisma.workout.delete({
                        where: {
                            id: allWorkoutsId[i].id,
                            routineId: +req.params.id
                        }
                    })];
            case 27:
                deleteWorkout = _a.sent();
                _a.label = 28;
            case 28:
                i++;
                return [3 /*break*/, 25];
            case 29:
                res.status(200).json({ message: "routine updated", routineUpdated: routineUpdated });
                return [3 /*break*/, 31];
            case 30:
                res.status(403).json({ message: "update routine failed" });
                _a.label = 31;
            case 31: return [2 /*return*/];
        }
    });
}); });
app.delete('/user/deleteRoutine/:id', authenticateUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedRoutine;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.routine.delete({
                    where: {
                        // unary operator used to typecast -> string to number
                        id: +req.params.id,
                        userId: req.userId
                    }
                })];
            case 1:
                deletedRoutine = _a.sent();
                if (deletedRoutine) {
                    res.status(200).json({ message: "Rountine successfully deleted", deletedRoutine: deletedRoutine });
                }
                else {
                    res.status(403).json({ message: "delete rountie failed" });
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/user/allRoutines', authenticateUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var allRoutines;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.routine.findMany({
                    where: {
                        userId: req.userId
                    }
                })];
            case 1:
                allRoutines = _a.sent();
                if (allRoutines) {
                    res.status(200).json(allRoutines);
                }
                else {
                    res.status(403).json({ message: "failed to get all routines" });
                }
                return [2 /*return*/];
        }
    });
}); });
app.get('/user/routine/:id', authenticateUser, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var routine;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.routine.findUnique({
                    where: {
                        id: +req.params.id,
                        userId: req.userId
                    },
                    include: {
                        workout: {
                            include: {
                                set: true
                            }
                        }
                    }
                })];
            case 1:
                routine = _a.sent();
                if (routine) {
                    res.status(200).json(routine);
                }
                else {
                    res.status(403).json({ message: "failed to get routine" });
                }
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () { console.log("listening to port " + port); });
