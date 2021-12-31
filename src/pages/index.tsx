import React, { useState } from 'react'
import styled from 'styled-components';
import { Modal, Button, Icon, Input, Progress, Container } from 'semantic-ui-react'
import { useTwitter } from '../utils/twitter'
import Long from 'long'
import JSZipUtils from 'jszip-utils'
import JSZip from 'jszip-immediate'
import { saveAs } from 'file-saver';

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
  const urls: { name: string; url: string }[] = []
  const twitter = new useTwitter()
  const [userName, setUserName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isZipping, setIsZipping] = useState(false)
  const [percent, setPercent] = useState(0)
  const [tweetProgressPercent, setTweetProgressPercent] = useState(50)

  const handleSearchUser = async () => {
    if (!userName) {
      alert('ユーザー名を入力してください')
      return
    }
    setIsLoading(true)
    setPercent(0)
    await getAllTimeLines()
    const result = await fetch('/api/twitter', {
      method: 'POST',
      body: JSON.stringify(urls.map(url => url.url))
    })
    const blob = await result.blob()
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `@${userName}.zip`;
    link.click();
    // saveAs(blob, `@${userName}.zip`);
  }

  const getAllTimeLines = async (maxId: string = undefined) => {
    const payload = {
      userName,
      maxId,
    }
    let nextMaxId
    const result = await twitter.getUserTimeLine(payload)
    if (result.length === 0) {
      return
    }
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

  const zipGenerateAsync = (zip: any) => {
    return new Promise((resolve, reject) => {
      zip.generateAsync({type: "blob"}).then(resolve);
    });
  };

  const getBinaryContent = (url: string, zip: any) => {
    return new JSZip.external.Promise((resolve: any, reject: any) => {
      JSZipUtils.getBinaryContent(url, (err: any, data: any) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    })
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
          {isLoading &&
            <div>
              <Progress percent={tweetProgressPercent} progress />
              ツイート読み込み中...
            </div>}
          {isDownloading &&
            <div>
            <Progress percent={percent} progress success />
            ダウンロード中...
            </div>}
          { isZipping && <div>zip作成中...</div> }
        </_Content>
      </_Index>
    </_Container>
  )
}
export default Index