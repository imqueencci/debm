/**
 * FIT-TI Questions
 * Pattern Codes: CONSISTENCY · RESTART · ANALYSIS · FLOW · EMOTION · BALANCE · RELATIONSHIP · OPTIMIZE
 * 번호(1234)는 UI 표시용. 결과 계산은 오직 code만 사용.
 */

const QUESTIONS = [
  {
    q: "운동을 꼭 가겠다고 마음먹었는데\n친구가 보자고 연락이 왔다.\n\n나라면?",
    answers: [
      { text: "운동도 친구도 놓치기 싫다",         code: "BALANCE" },
      { text: "그냥 더 끌리는 쪽으로 간다",         code: "FLOW" },
      { text: "나와의 약속을 지키러 운동하러 간다",  code: "CONSISTENCY" },
      { text: "친구가 더 중요하다",                 code: "RELATIONSHIP" }
    ]
  },
  {
    q: "회식 끝.\n집 가는 길에 편의점이 보인다.\n\n나라면?",
    answers: [
      { text: "내일부터 다시 식단 시작",             code: "OPTIMIZE" },
      { text: "회식 한 번에 흔들릴 정도는 아니다",   code: "CONSISTENCY" },
      { text: "어차피 오늘은 망했다",                code: "RESTART" },
      { text: "내일 후회할 걸 아니까 참는다",        code: "CONSISTENCY" }
    ]
  },
  {
    q: "2주 동안 운동을 잘하다가 하루 빠트렸다.\n\n다음 날 나는?",
    answers: [
      { text: "별생각 없다",                         code: "FLOW" },
      { text: "계획부터 다시 짠다",                  code: "ANALYSIS" },
      { text: "원래 하던 대로 다시 간다",            code: "CONSISTENCY" },
      { text: "이번 주는 망했다. 다음 주부터",       code: "RESTART" }
    ]
  },
  {
    q: "몸무게를 쟀다.\n1kg 늘었다.\n\n제일 먼저 드는 생각은?",
    answers: [
      { text: "오늘부터 더 빡세게 해야겠다",         code: "RESTART" },
      { text: "하루 이틀은 원래 그럴 수 있다",       code: "CONSISTENCY" },
      { text: "왜 늘었는지부터 본다",                code: "ANALYSIS" },
      { text: "역시 이럴 줄 알았어",                 code: "EMOTION" }
    ]
  },
  {
    q: "배는 부른데\n냉장고에 좋아하는 간식이 있다.\n\n나라면?",
    answers: [
      { text: "한참 고민하다 다른 걸 찾는다",        code: "ANALYSIS" },
      { text: "어차피 먹은 거, 내일부터 빡세게 한다", code: "RESTART" },
      { text: "내일 후회할 것 같아서 안 먹는다",     code: "CONSISTENCY" },
      { text: "딱 한 입이면 괜찮다고 생각한다",      code: "BALANCE" }
    ]
  },
  {
    q: "평소 사고 싶던 가방이 있다.\n생일이라 사려는데 생각보다 비싸다.\n\n나라면?",
    answers: [
      { text: "비슷한 제품을 찾는다",                code: "BALANCE" },
      { text: "특별한 날이니까 괜찮다",              code: "FLOW" },
      { text: "지금은 안 사고 돈부터 모은다",        code: "CONSISTENCY" },
      { text: "더 싸게 살 방법을 찾는다",            code: "ANALYSIS" }
    ]
  },
  {
    q: "갑자기 야근을 하게 됐다.\n오늘은 운동 갈 시간이 없다.\n\n나라면?",
    answers: [
      { text: "집 갈 때라도 조금 더 움직인다",       code: "BALANCE" },
      { text: "잘됐다",                              code: "FLOW" },
      { text: "내일 하면 된다",                      code: "OPTIMIZE" },
      { text: "짧게라도 한다",                       code: "CONSISTENCY" }
    ]
  },
  {
    q: "SNS를 보는데\n나보다 늦게 시작한 사람이 더 많이 변했다.\n\n제일 먼저 드는 생각은?",
    answers: [
      { text: "왜 차이가 났는지 분석한다",           code: "ANALYSIS" },
      { text: "굳이 비교하지 않는다",                code: "FLOW" },
      { text: "역시 나는 안 되나 보다",              code: "EMOTION" },
      { text: "나도 더 해봐야겠다",                  code: "CONSISTENCY" }
    ]
  },
  {
    q: "운동 가려고 했는데\n비가 온다.\n\n나라면?",
    answers: [
      { text: "오늘 운동하면 더 개운하겠다 긍정적으로 전환한다", code: "CONSISTENCY" },
      { text: "비 때문에 못 하는 거라 죄책감은 없다",           code: "FLOW" },
      { text: "다른 방법으로라도 한다",                         code: "BALANCE" },
      { text: "오늘은 쉰다",                                    code: "RELATIONSHIP" }
    ]
  },
  {
    q: "늦지 않으려면 저 버스를 타야 한다.\n그런데 놓쳤다.\n\n나라면?",
    answers: [
      { text: "순간 머리가 하얘진다",                code: "EMOTION" },
      { text: "늦지 않을 다른 방법부터 찾는다",      code: "ANALYSIS" },
      { text: "사람은 늦을 수도 있다고 생각한다",    code: "FLOW" },
      { text: "먼저 연락해서 상황을 알린다",         code: "CONSISTENCY" }
    ]
  },
  {
    q: "오늘 정말 힘든 하루였다.\n집에 왔다.\n\n나라면?",
    answers: [
      { text: "먹으면 좀 나아질 것 같다",            code: "EMOTION" },
      { text: "하루를 곱씹는다",                     code: "ANALYSIS" },
      { text: "움직이면 좀 나아질 것 같다",          code: "CONSISTENCY" },
      { text: "그냥 일찍 눕는다",                    code: "FLOW" }
    ]
  },
  {
    q: "다이어트를 하면서\n가장 많이 했던 생각은?",
    answers: [
      { text: "나한테 맞는 방법이 따로 있는 것 같다",       code: "OPTIMIZE" },
      { text: "이번엔 진짜 끝까지 해보자",                  code: "CONSISTENCY" },
      { text: "다 잘 지키는 것 같은데 결과가 안 나온다",   code: "ANALYSIS" },
      { text: "왜 항상 결과가 비슷하지?",                  code: "EMOTION" }
    ]
  }
];
