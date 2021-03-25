# https://somjang.tistory.com/entry/Python-Slack-WebHooks-%EC%9D%84-%ED%86%B5%ED%95%B4-%[…]%EB%B0%9B%EC%95%84%EB%B3%B4%EA%B8%B0-feat-Incoming-WebHooks
git gc
docker-compose -f docker-compose.yml up -d --build > deploy_result
if [ ! 0 = $? ]; then
        message=`cat deploy_result`
        curl -X POST --data-urlencode "payload={\"channel\": \"#frontend-deploy-noti\", \"username\": \"webhookbot\", \"text\": \"(Prod) UYI 웹프로젝트 배포에 실패하였습니다. $message\", \"icon_emoji\": \":sob:\"}" https://hooks.slack.com/services/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
else
        curl -X POST --data-urlencode "payload={\"channel\": \"#frontend-deploy-noti\", \"username\": \"webhookbot\", \"text\": \"(Prod) UYI 웹프로젝트 배포에 성공하였습니다.\", \"icon_emoji\": \":sunglasses:\"}" https://hooks.slack.com/services/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
fi
# docker rmi $(docker images -f "dangling=true" -q)
# echo "remote volumn"
docker volume rm $(docker volume ls -qf dangling=true)
# echo "remote docker images"
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")
docker images -a | sed '1 d' | awk '{print $3}' | xargs -L1 docker rmi -f