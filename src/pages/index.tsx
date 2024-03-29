import Head from 'next/head'
import styles from '@/styles/home.module.scss'
import {Button, Form, Input, message, FloatButton} from 'antd';
import React, {useEffect, useState} from 'react';
import {ConnectionType, EasterEgg, FormDataType} from '@/const';
import {QuestionCircleOutlined, SettingOutlined} from '@ant-design/icons';
import SettingDrawer from '@/pages/components/setting-drawer';
import {UploadChangeParam} from 'antd/es/upload';

const layout = {
    labelCol: {span: 6},
};

const tailLayout = {
    wrapperCol: {offset: 6, span: 16},
};

interface Props {
    dynamicTitle: string;
}

export async function getServerSideProps() {
    const response = await fetch('http://localhost:3000/api/title');
    const data = await response.json();

    const dynamicTitle = data?.data?.page_title;

    return {
        props: {
            dynamicTitle: dynamicTitle || '',
        },
    };
}

export default function Home({dynamicTitle}: Props) {
    const [form] = Form.useForm();
    const [formData, setFormData] = useState<FormDataType>();
    const [nextInvocationTime, setInvocationTime] = useState('');
    const [validateChatIDStatus, setValidateChatIDStatus] = useState('');
    const [validateRSSStatus, setValidateRSSStatus] = useState('');
    const [open, setOpen] = useState(false);

    const handleDrawerVisible = (visible: boolean) => {
        setOpen(visible);
    };

    useEffect(() => {
        // 从 API 获取数据
        console.log(
            "\n" +
            " %c Built by 六只鱼® %c https://github.com/BarryLiu1995 " +
            "\n",
            "color: #fadfa3; background: #030307; padding:5px 0; font-size:18px;",
            "background: #fadfa3; padding:5px 0; font-size:18px;"
        );
        console.log(EasterEgg)
        fetch('/api/config')
            .then(response => response.json())
            .then(data => {
                setFormData(data.data);
            })
            .catch(error => console.error(error));
        fetch('/api/job')
            .then(response => response.json())
            .then(data => {
                setInvocationTime(data?.data.nextInvocationTime);
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            ...formData
        });
    }, [formData, form]);

    const onSubmit = async (values: any) => {
        try {
            const response = await fetch('/api/job', {
                method: 'POST',
                body: JSON.stringify(values),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
            if (!response.ok) {
                throw Error(response.statusText)
            }
            const data = await response.json();
            setInvocationTime(data.data.nextInvocationTime);
            message.success(data.msg);
        } catch (error) {
            message.error(`${error}`);
            console.error(error);
        }
    };

    const onTerminate = async () => {
        try {
            const response = await fetch('/api/job', {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw Error(response.statusText)
            }
            const data = await response.json();
            setInvocationTime(data.data.nextInvocationTime);
            message.success(data.msg);
        } catch (error) {
            message.error(`${error}`);
            console.error(error);
        }
    }

    const onCallOnce = async () => {
        try {
            const response = await fetch('/api/job', {
                method: 'PUT'
            });
            if (!response.ok) {
                throw Error(response.statusText)
            }
            const data = await response.json();
            message.success(data.msg);
        } catch (error) {
            message.error(`${error}`);
            console.error(error);
        }
    }

    const checkTele = async (telegram_bot_token: string, telegram_chat_id: string) => {
        if (!telegram_bot_token || !telegram_chat_id) {
            return;
        }
        setValidateChatIDStatus('validating');
        try {
            const response = await fetch(`/api/connection`, {
                method: 'POST',
                body: JSON.stringify({
                    type: ConnectionType.Tele,
                    telegram_bot_token,
                    telegram_chat_id,
                }),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
            if (response.ok) {
                setValidateChatIDStatus('success');// 在这里处理测试成功的逻辑
            } else {
                throw new Error(response.statusText)
            }
        } catch (e) {
            console.error(e);
            setValidateChatIDStatus('error');
        }
    };

    const checkRSSDomain = async (url: string) => {
        setValidateRSSStatus('validating');
        try {
            const resp = await fetch('/api/connection', {
                method: 'POST',
                body: JSON.stringify({
                    type: ConnectionType.RSS,
                    url,
                }),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            });
            if (resp.ok) {
                setValidateRSSStatus('success');
            } else {
                throw new Error(resp.statusText);
            }
        } catch (e) {
            setValidateRSSStatus('error');
            console.error(e);
        }
    };

    const uploadOnChange = function (info: UploadChangeParam) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 配置文件解析成功`);
            const result = (info.file.response as any).data;
            setFormData({
                ...result,
                cookies: formData?.cookies
            });
            checkRSSDomain(result.rss_domain);
            checkTele(result.telegram_bot_token, result.telegram_chat_id);
            handleDrawerVisible(false);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 配置文件解析失败`);
        }
    }

    return (
        <>
            <Head>
                <title>{dynamicTitle || '配置页面'}</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <meta name="referrer" content="no-referrer" /> // 通过添加上面的html，告诉客户端不带这个referrer信息
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={styles.main}>
                <Button
                    className={styles.setting}
                    type="text"
                    icon={<SettingOutlined style={{fontSize: '16px'}}/>}
                    onClick={() => handleDrawerVisible(true)}
                />
                <SettingDrawer open={open}
                               nextInvocationTime={nextInvocationTime}
                               drawerOnClose={() => handleDrawerVisible(false)}
                               uploadOnChange={uploadOnChange}/>
                <div className={styles.container}>
                    <Form
                        {...layout}
                        form={form}
                        name="control-hooks"
                        initialValues={{rss_domain: 'https://rsshub.app', cron: '0 10,19 * * *'}}
                        onFinish={onSubmit}
                        className={styles.form}
                    >
                        <Form.Item
                            label="TG 推送"
                            style={{marginBottom: 0}}
                            tooltip={<span>查阅<a target="_blank" style={{textDecoration: "underline"}}
                                                  href="https://hellodk.cn/post/743">Telegram 创建 bot 获取 token 和 chatID 以及发送消息简明教程</a></span>}
                        >
                            <Form.Item
                                name="telegram_bot_token"
                                style={{display: 'inline-block', width: 'calc(50% - 8px)'}}
                            >
                                <Input placeholder="请输入 TG token"/>
                            </Form.Item>
                            <Form.Item
                                name="telegram_chat_id"
                                style={{display: 'inline-block', width: '50%', margin: '0 0 0 8px'}}
                                hasFeedback
                                validateStatus={validateChatIDStatus as ""}
                            >
                                <Input
                                    placeholder="请输入 TG chat id"
                                    onBlur={e => checkTele(form.getFieldValue('telegram_bot_token'), e.target.value)}
                                />
                            </Form.Item>
                        </Form.Item>
                        <Form.Item
                            label="收藏夹 URL"
                            name="fav_url"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入收藏夹链接'
                                },
                                {
                                    pattern: new RegExp('^https?:\\/\\/space\\.bilibili\\.com\\/.+?\\/favlist\\?fid=.+?$'),
                                    message: '请输入正确的收藏夹地址'
                                }
                            ]}
                        >
                            <Input
                                placeholder="例如 https://space.bilibili.com/31386575/favlist?fid=2006220975&ftype=create"/>
                        </Form.Item>
                        <Form.Item
                            name="rss_domain"
                            label="RSSHub 服务"
                            hasFeedback
                            validateStatus={validateRSSStatus as ""}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入 RssHub 服务地址'
                                },
                                {
                                    pattern: new RegExp('^(http|https):\\/\\/[^\\s/$.?#].[^\\s]*[^/]$'),
                                    message: '请输入符合的地址，注意不要以 / 结尾'
                                }
                            ]}>
                            <Input onBlur={e => checkRSSDomain(e.target.value)}/>
                        </Form.Item>
                        <Form.Item
                            name="cron"
                            label="Cron 定时"
                            rules={[{required: true}]}
                            tooltip={<span>查阅 <a target="_blank" style={{textDecoration: "underline"}}
                                                   href="https://crontab.guru/#0_10,19_*_*_*">Cron 表达式解析</a></span>}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item label="下次执行时间">
                            <span>{nextInvocationTime ? new Date(nextInvocationTime).toLocaleString() : '暂未有任务运行中'}</span>
                        </Form.Item>
                        <Form.Item {...tailLayout} className={styles.buttons}>
                            <Button type="primary" htmlType="submit">
                                {`${nextInvocationTime ? '更新' : '开启'}任务`}
                            </Button>
                            <Button htmlType="button" onClick={onTerminate} className={styles.reset}
                                    disabled={!nextInvocationTime}>
                                结束任务
                            </Button>
                            <Button htmlType="button" onClick={onCallOnce} className={styles.reset}
                                    disabled={!nextInvocationTime}>
                                手动执行
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <FloatButton
                    href="/videos/demo.mp4"
                    target="_blank"
                    icon={<QuestionCircleOutlined/>}
                    type="default"
                    style={{right: 24}}
                />
            </main>
        </>
    )
}
