import request from "@/utils/request";
import { apiConfig } from "../config/api";

export function findArticle(articleCode) {
  return request({
    url: apiConfig.article.api.info.url,
    method: "post",
    params: { articleCode: articleCode }
  });
}
//添加文章
export function addJicArticle(article) {
  return request({
    url: apiConfig.article.api.add.url,
    method: "post",
    data: {
      title: article.title,
      subTitle: article.subTitle,
      summary: article.summary,
      articleType: article.articleType,
      subType: article.subType,
      author: article.author,
      outerChain: article.outerChain,
      url: article.url,
      content: article.content,
      showFlag: article.showFlag,
      messageFlag: article.messageFlag,
      messageImg: article.messageImg,
      messageContent: article.messageContent
    }
  });
}

//更新文章
export function modifyJicArticle(article) {
  return request({
    url: apiConfig.article.api.modify.url,
    method: "post",
    data: {
      articleCode: article.articleCode,
      title: article.title,
      subTitle: article.subTitle,
      summary: article.summary,
      articleType: article.articleType,
      subType: article.subType,
      author: article.author,
      outerChain: article.outerChain,
      url: article.url,
      content: article.content,
      showFlag: article.showFlag,
      messageFlag: article.messageFlag,
      messageImg: article.messageImg,
      messageContent: article.messageContent
    }
  });
}
//删除文章
export function deleteLogicJicArticle(articleCode) {
  return request({
    url: apiConfig.article.api.delete.url,
    method: "post",
    params: { articleCode: articleCode }
  });
}

//获取列表
export function listPage(
  pageNum,
  pageSize,
  title,
  scope,
  articleType,
  subType,
  author,
  beginDate,
  endDate,
  isPush
) {
  return request({
    url: apiConfig.article.api.list.url,
    method: "post",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      title: title,
      scope: scope,
      articleType: articleType,
      subType: subType,
      author: author,
      beginDate: beginDate,
      endDate: endDate,
      isPush: isPush
    }
  });
}

//发布和撤回
export function updateShowFlag(articleCode, showFlag, messageFlag) {
  return request({
    url: apiConfig.article.api.showFlag.url,
    method: "post",
    params: {
      articleCode: articleCode,
      showFlag: showFlag,
      messageFlag: messageFlag
    }
  });
}
export function findPagesList(
  pageNum,
  pageSize,
  flag,
  uid,
  nickName,
  questionType,
  question,
  phone
) {
  return request({
    url: apiConfig.feedback.api.feedbackList.url,
    method: "get",
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      flag: flag,
      uid: uid,
      nickName: nickName,
      questionType: questionType,
      question: question,
      phone: phone
    }
  });
}

/**
 * 回复
 * @param id
 * @param reply
 */
export function replayUserFeedback(id, reply) {
  return request({
    url: apiConfig.feedback.api.reply.url,
    method: "post",
    params: {
      id: id,
      reply: reply
    }
  });
}

// export function findOneById(id) {
//   return request({
//     url: apiConfig.feedback.api.one.url,
//     method: "get",
//     params: { id: id }
//   });
// }
