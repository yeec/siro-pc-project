import request from "@/utils/request";
import { apiConfig } from "../config/api";

//医院修改
export function modifyHospitalInfo(
  hospitalCode,
  hospitalName,
  hospitalDesc,
  hospitalIntro,
  location
) {
  return request({
    url: apiConfig.hospital.api.modify.url,
    method: "post",
    data: {
      hospitalCode: hospitalCode,
      hospitalName: hospitalName,
      hospitalDesc: hospitalDesc,
      hospitalIntro: hospitalIntro,
      location: location
    }
  });
}
export function infoHospitalInfo(hospitalCode) {
  return request({
    url: apiConfig.hospital.api.info.url,
    method: "get",
    params: {
      hospitalCode: hospitalCode
    }
  });
}
export function oneHospitalInfo() {
  return request({
    url: apiConfig.hospital.api.one.url,
    method: "get"
  });
}
export function addHospitalDepartment(hospitalDepartment) {
  return request({
    url: apiConfig.hosdepart.api.add.url,
    method: "post",
    data: {
      departmentCode: hospitalDepartment.departmentCode,
      parentCode: hospitalDepartment.parentCode,
      departmentName: hospitalDepartment.departmentName,
      departmentDesc: hospitalDepartment.departmentDesc,
      tel: hospitalDepartment.tel,
      location: hospitalDepartment.location,
      departmentIntr: hospitalDepartment.departmentIntr,
      amStartTime: hospitalDepartment.amStartTime,
      amEndTime: hospitalDepartment.amEndTime,
      pmStartTime: hospitalDepartment.pmStartTime,
      pmEndTime: hospitalDepartment.pmEndTime,
      idx: hospitalDepartment.idx,
      pic: hospitalDepartment.pic
    }
  });
}
export function deleteHospitalDepartment(hospitalCode) {
  return request({
    url: apiConfig.hosdepart.api.delete.url,
    method: "post",
    params: {
      hospitalCode: hospitalCode
    }
  });
}
export function modifyHospitalDepartment(hospitalDepartment) {
  return request({
    url: apiConfig.hosdepart.api.modify.url,
    method: "post",
    data: {
      departmentCode: hospitalDepartment.departmentCode,
      parentCode: hospitalDepartment.parentCode,
      departmentName: hospitalDepartment.departmentName,
      departmentDesc: hospitalDepartment.departmentDesc,
      tel: hospitalDepartment.tel,
      location: hospitalDepartment.location,
      departmentIntr: hospitalDepartment.departmentIntr,
      amStartTime: hospitalDepartment.amStartTime,
      amEndTime: hospitalDepartment.amEndTime,
      pmStartTime: hospitalDepartment.pmStartTime,
      pmEndTime: hospitalDepartment.pmEndTime,
      idx: hospitalDepartment.idx,
      pic: hospitalDepartment.pic
    }
  });
}
export function findDepartmentTree(parentCode, flag) {
  return request({
    url: apiConfig.hosdepart.api.tree.url,
    method: "post",
    params: {
      parentCode: parentCode,
      flag: flag
    }
  });
}
export function findHospitalDepartmentByCode(departmentCode) {
  return request({
    url: apiConfig.hosdepart.api.info.url,
    method: "post",
    params: {
      departmentCode: departmentCode
    }
  });
}
export function addHospitalDoctor(hospitalDoctor) {
  return request({
    url: apiConfig.doctor.api.add.url,
    method: "post",
    data: {
      doctorCode: hospitalDoctor.doctorCode,
      name: hospitalDoctor.name,
      sex: hospitalDoctor.sex,
      pic: hospitalDoctor.pic,
      department: hospitalDoctor.department,
      position: hospitalDoctor.position,
      expertise: hospitalDoctor.expertise,
      idcard: hospitalDoctor.idcard,
      jobnum: hospitalDoctor.jobnum,
      duty: hospitalDoctor.duty,
      tel: hospitalDoctor.tel,
      introduction: hospitalDoctor.introduction,
      expertFlag: hospitalDoctor.expertFlag
    }
  });
}
export function deleteHospitalDoctor(doctorCode) {
  return request({
    url: apiConfig.doctor.api.delete.url,
    method: "post",
    params: {
      doctorCode: doctorCode
    }
  });
}
export function modifyHospitalDoctor(hospitalDoctor) {
  return request({
    url: apiConfig.doctor.api.modify.url,
    method: "post",
    data: {
      doctorCode: hospitalDoctor.doctorCode,
      name: hospitalDoctor.name,
      sex: hospitalDoctor.sex,
      pic: hospitalDoctor.pic,
      department: hospitalDoctor.department,
      position: hospitalDoctor.position,
      expertise: hospitalDoctor.expertise,
      idcard: hospitalDoctor.idcard,
      jobnum: hospitalDoctor.jobnum,
      duty: hospitalDoctor.duty,
      tel: hospitalDoctor.tel,
      introduction: hospitalDoctor.introduction,
      expertFlag: hospitalDoctor.expertFlag
    }
  });
}
export function hospitalDoctorsPages(
  pageNum,
  pageSize,
  orderBy,
  name,
  department,
  position,
  scope
) {
  return request({
    url: apiConfig.doctor.api.list.url,
    method: "post",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      orderBy: orderBy,
      name: name,
      department: department,
      position: position,
      scope: scope
    }
  });
}
export function hospitalDoctorsList(expertFlag, department) {
  return request({
    url: apiConfig.doctor.api.listDepart.url,
    method: "post",
    params: {
      expertFlag: expertFlag,
      department: department
    }
  });
}
export function findHospitalDoctorInfo(doctorCode) {
  return request({
    url: apiConfig.doctor.api.info.url,
    method: "post",
    params: {
      doctorCode: doctorCode
    }
  });
}
export function findAll(bodyCode, bodyName) {
  return request({
    url: apiConfig.body.api.list.url,
    method: "get",
    params: {
      bodyCode: bodyCode,
      bodyName: bodyName
    }
  });
}
export function modifyBodyInfo(bodyCode, bodyName, bodyDesc) {
  return request({
    url: apiConfig.body.api.modify.url,
    method: "post",
    params: {
      bodyCode: bodyCode,
      bodyName: bodyName,
      bodyDesc: bodyDesc
    }
  });
}
export function setBodySymptomsRel(bodySymptomsRequest) {
  return request({
    url: apiConfig.body.api.setSymptomsRel.url,
    method: "post",
    data: bodySymptomsRequest
  });
}
export function addSymptomsInfo(symptomCode, symptomName, symptomDesc, gender) {
  return request({
    url: apiConfig.symptom.api.add.url,
    method: "post",
    params: {
      symptomCode: symptomCode,
      symptomName: symptomName,
      symptomDesc: symptomDesc,
      gender: gender
    }
  });
}
export function deleteSymptomsInfo(symptomCode) {
  return request({
    url: apiConfig.symptom.api.delete.url,
    method: "post",
    params: {
      symptomCode: symptomCode
    }
  });
}
export function modifySymptomsInfo(
  symptomCode,
  symptomName,
  symptomDesc,
  gender
) {
  return request({
    url: apiConfig.symptom.api.modify.url,
    method: "post",
    params: {
      symptomCode: symptomCode,
      symptomName: symptomName,
      symptomDesc: symptomDesc,
      gender: gender
    }
  });
}
export function symptomListPage(
  pageNum,
  pageSize,
  scope,
  symptomName,
  symptomCode,
  gender
) {
  return request({
    url: apiConfig.symptom.api.list.url,
    method: "post",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      scope: scope,
      symptomName: symptomName,
      symptomCode: symptomCode,
      gender: gender
    }
  });
}
export function symptomList() {
  return request({
    url: apiConfig.symptom.api.allList.url,
    method: "get"
  });
}
export function findSymptomsInfoBySymptomCode(symptomCode) {
  return request({
    url: apiConfig.symptom.api.info.url,
    method: "post",
    params: {
      symptomCode: symptomCode
    }
  });
}
export function addDiseaseInfo(diseaseInfo) {
  return request({
    url: apiConfig.disease.api.add.url,
    method: "post",
    data: {
      diseaseCode: diseaseInfo.diseaseCode,
      diseaseName: diseaseInfo.diseaseName,
      diseaseDesc: diseaseInfo.diseaseDesc,
      diseaseSymptomsDesc: diseaseInfo.diseaseSymptomsDesc,
      diseaseExaminationDesc: diseaseInfo.diseaseExaminationDesc,
      diseaseTreatingDesc: diseaseInfo.diseaseTreatingDesc,
      diseasePapDesc: diseaseInfo.diseasePapDesc,
      departments: diseaseInfo.departments
    }
  });
}
export function deleteDiseaseInfo(diseaseCode) {
  return request({
    url: apiConfig.disease.api.delete.url,
    method: "post",
    params: {
      diseaseCode: diseaseCode
    }
  });
}
export function modifyDiseaseInfo(diseaseInfo) {
  return request({
    url: apiConfig.disease.api.modify.url,
    method: "post",
    data: {
      diseaseCode: diseaseInfo.diseaseCode,
      diseaseName: diseaseInfo.diseaseName,
      diseaseDesc: diseaseInfo.diseaseDesc,
      diseaseSymptomsDesc: diseaseInfo.diseaseSymptomsDesc,
      diseaseExaminationDesc: diseaseInfo.diseaseExaminationDesc,
      diseaseTreatingDesc: diseaseInfo.diseaseTreatingDesc,
      diseasePapDesc: diseaseInfo.diseasePapDesc,
      departments: diseaseInfo.departments
    }
  });
}
export function diseaseListPage(
  pageNum,
  pageSize,
  scope,
  diseaseName,
  diseaseCode
) {
  return request({
    url: apiConfig.disease.api.list.url,
    method: "post",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      scope: scope,
      diseaseName: diseaseName,
      diseaseCode: diseaseCode
    }
  });
}
export function findDiseaseInfoByDiseaseCode(diseaseCode) {
  return request({
    url: apiConfig.disease.api.info.url,
    method: "get",
    params: {
      diseaseCode: diseaseCode
    }
  });
}
export function symptomListPageByDiseaseCode(
  pageNum,
  pageSize,
  diseaseCode,
  symptomName
) {
  return request({
    url: apiConfig.symptom.api.listByDisease.url,
    method: "post",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      diseaseCode: diseaseCode,
      symptomName: symptomName
    }
  });
}
export function symptomListByDiseaseCode(diseaseCode) {
  return request({
    url: apiConfig.symptom.api.allListByDisease.url,
    method: "post",
    params: {
      diseaseCode: diseaseCode
    }
  });
}
export function symptomListPageByBodyCode(
  pageNum,
  pageSize,
  bodyCode,
  symptomName
) {
  return request({
    url: apiConfig.symptom.api.listByBody.url,
    method: "post",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      bodyCode: bodyCode,
      symptomName: symptomName
    }
  });
}
export function symptomListByBodyCode(bodyCode) {
  return request({
    url: apiConfig.symptom.api.allListByBody.url,
    method: "post",
    params: {
      bodyCode: bodyCode
    }
  });
}
export function listDiseaseAndRelSymptoms(symptomCode) {
  return request({
    url: apiConfig.symptom.api.listDiseaseAndRelSymptoms.url,
    method: "post",
    params: {
      symptomCode: symptomCode
    }
  });
}
export function setDiseaseSymptomsRel(bodySymptomsRequest) {
  return request({
    url: apiConfig.disease.api.setSymptomsRel.url,
    method: "post",
    data: bodySymptomsRequest
  });
}
export function followDoctorSetConcern(uid, doctorCode) {
  return request({
    url: apiConfig.doctor.api.followDoctor.url,
    method: "post",
    params: {
      uid: uid,
      doctorCode: doctorCode
    }
  });
}
export function followedDoctorList(pageNum, pageSize, uid) {
  return request({
    url: apiConfig.doctor.api.followedDoctorList.url,
    method: "post",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      uid: uid
    }
  });
}
export function fingDoctorListByDepartmentCode(expertFlag, departmentCode) {
  return request({
    url: apiConfig.doctor.api.listByDepartment.url,
    method: "post",
    params: {
      expertFlag: expertFlag,
      departmentCode: departmentCode
    }
  });
}
export function addDoctorJobSchedulingRule(doctorJobSchedulingRuleList) {
  return request({
    url: apiConfig.doctorScheduling.api.ruleAdd.url,
    method: "post",
    data: doctorJobSchedulingRuleList
  });
}
export function modifyDoctorJobSchedulingRule(doctorJobSchedulingRuleList) {
  return request({
    url: apiConfig.doctorScheduling.api.ruleModify.url,
    method: "post",
    data: doctorJobSchedulingRuleList
  });
}
export function deleteLogicDoctorJobSchedulingRule(ruleCodeList) {
  return request({
    url: apiConfig.doctorScheduling.api.ruleDelete.url,
    method: "post",
    data: ruleCodeList
  });
}
export function setRuleGenerateFlag(schedulingRuleCode, generateFlag) {
  return request({
    url: apiConfig.doctorScheduling.api.setGenerateFlag.url,
    method: "post",
    params: {
      schedulingRuleCode: schedulingRuleCode,
      generateFlag: generateFlag
    }
  });
}
export function findAllRulesFlag(doctorCode) {
  return request({
    url: apiConfig.doctorScheduling.api.ruleList.url,
    method: "post",
    params: {
      doctorCode: doctorCode
    }
  });
}
export function findAllDoctorJobScheduling(flag, doctorCode, beginDate) {
  return request({
    url: apiConfig.doctorScheduling.api.list.url,
    method: "post",
    params: {
      flag: flag,
      doctorCode: doctorCode,
      beginDate: beginDate
    }
  });
}
export function deleteLogicDoctorJobScheduling(schedulingCodeList) {
  return request({
    url: apiConfig.doctorScheduling.api.delete.url,
    method: "post",
    data: schedulingCodeList
  });
}
export function modifyDoctorJobSchedulingList(doctorJobSchedulingList) {
  return request({
    url: apiConfig.doctorScheduling.api.modify.url,
    method: "post",
    data: doctorJobSchedulingList
  });
}
export function addDoctorJobSchedulingList(doctorJobSchedulingList) {
  return request({
    url: apiConfig.doctorScheduling.api.add.url,
    method: "post",
    data: doctorJobSchedulingList
  });
}
