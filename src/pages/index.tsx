import React, { useState } from 'react'
import styled from 'styled-components';
import { Button, Input, Message, Progress } from 'semantic-ui-react'
import { useTwitter } from '../utils/twitter'
import Long from 'long'
import { saveAs } from 'file-saver';
import { trpc } from 'src/utils/trpc';

const _Container = styled.div`
  height: 100vh;
  margin: 0 24px;
  text-align: left;
  font-size: 16px;
`

const _Index = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const _Text = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
`

const _InputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  div:first-child {
    margin-right: 20px;
  }
`

const _Content = styled.div`
    width: 100%;
  `
const Index = () => {
  const createDownload = trpc.useMutation(['downloads.create'])
  const urls: { name: string; url: string }[] = []
  const twitter = new useTwitter()
  const [userName, setUserName] = useState('')
  const [progressMessage, setProgressMessage] = useState({ has: false, message: '' })
  const [percent, setPercent] = useState(0)
  const [message, setMessage] = useState<{ has: boolean, text: string; type: 'green' | 'red' }>({ has: false, text: '', type: 'green' })

  const handleDismiss = () => {
    setMessage({ has: false, text: '', type: 'green' })
    setProgressMessage({ has: false, message: '' })
  }

  const handleSearchUser = async () => {
    if (!userName) {
      alert('ユーザー名を入力してください')
      return
    }
    setProgressMessage({ has: true, message: 'ツイートの読み込みを開始しました' })
    try {
      await getAllTimeLines()
      setProgressMessage({ has: true, message: 'ツイートの読み込みが完了しました' })
      await createDownload.mutateAsync({ user_name: userName })
      const result = await fetch('/api/twitter', {
        method: 'POST',
        body: JSON.stringify(urls.map(url => url.url))
      })
      const blob = await result.blob()
      setMessage({ has: true, text: 'ダウンロードが成功しました', type: 'green' })
      setProgressMessage({ has: true, message: 'zip作成中...' })
      saveAs(blob, `@${userName}.zip`);

      setProgressMessage({ has: true, message: '完了しました' })
      setMessage({ has: true, text: 'ダウンロードが成功しました', type: 'green' })

      setTimeout(() => {
        handleDismiss()
      }, 3000)

    } catch (e) {
      setMessage({ has: true, text: 'タイムラインの取得に失敗しました', type: 'red' })
      setProgressMessage({ has: false, message: '' })
    }
  }

  const getAllTimeLines = async (maxId = undefined) => {
    const payload = {
      userName,
      maxId,
    }
    let nextMaxId
    const result = await twitter.getUserTimeLine(payload)
    if (result.length === 0) {
      setPercent(100)
      return
    }
    setPercent(50)
    result.map((tweet: any) => {
      const searchUrl = 'https'
      const baseText = tweet.text.split(' ')[0]
      const hasUrl = baseText.indexOf(searchUrl)
      const text = hasUrl !== -1 ? baseText.slice(hasUrl) : baseText
      const outputText = text.indexOf(searchUrl) !== -1 ? 'image': text
      if (tweet.extended_entities) {
        tweet.extended_entities.media.forEach((media: any, index: number) => {
          if (media.type === 'video') {
            const video = media.video_info.variants.filter((item: any) => item.bitrate).sort((a: any, b: any) => b.bitrate - a.bitrate)[0]
            urls.push({ name: `${outputText}_${index + 1}`, url: video.url })
          } else if (media.type === 'photo') {
            urls.push({ name: `${outputText}_${index + 1}`, url: media.media_url_https })
          }
        })
      }
      const longId = Long.fromString(tweet.id_str);
      const longIdSub = longId.subtract(1);
      nextMaxId = longIdSub.toString();
    })
    await getAllTimeLines(nextMaxId)
  }

  return (
    <_Container>
      <_Index>
        <_Text>
          <div>特定のユーザーのメディアをzip形式で取得します ※最新3200ツイートの中から取得</div>
          </_Text>
        <_InputContainer>
          <Input value={userName} onChange={(e) => setUserName(e.target.value)} icon='at' iconPosition='left' placeholder='ユーザー名で検索' />
          <Button color="blue" onClick={handleSearchUser}>検索</Button>
        </_InputContainer>
        <_Content>
          {
            progressMessage.has &&
            <div>
            <Progress percent={percent} progress success />
            { progressMessage.message }
            </div>
          }
        </_Content>
        {
          message.has && <Message color={message.type} onDismiss={handleDismiss}>
            {message.text}
          </Message>
        }
      </_Index>
    </_Container>
  )
}
export default Index