import axios from "axios";
export async function fetchLiveRoomProductResult(
    room_id: string,
    author_id: string,
    cookies: string
) {
    const params: any = {
        room_id: room_id,
        author_id: author_id
    };
    const response = await axios.post(
        "https://live.douyin.com/live/promotions/page/",
        "",
        {
            params: params,
            headers: {
                cookie: cookies
            }
        }
    );
    return response.data;
}

async function main() {
    const room_id: string = `7517550487244147467`;
    const author_id: string = `4385304885332387`;
    const cookies: string =
        "enter_pc_once=1; UIFID_TEMP=e71d819f1cb72e7166823ce125547a3e5a83b631a52f7c0b3c34cd9714dd602dbceb9ed539114bafbdc2825dca4d335a132d06c7fad2a9339821b778075030f3c8207d2044793059202efd663cdfb7bc; hevc_supported=true; home_can_add_dy_2_desktop=%220%22; strategyABtestKey=%221750315382.122%22; ttwid=1%7C0mZ0XOArZYwEqhkkA-ScJ5iqgFsBz2zyqV2hCnuD8E4%7C1750315392%7Cfa133dae0abb8c6e043e2b2fdbccc751c602d0fc49a9b963bcf5b2595166fa08; passport_csrf_token=a63121dbcecbab4a73816f131f4f1666; passport_csrf_token_default=a63121dbcecbab4a73816f131f4f1666; biz_trace_id=04135391; __security_mc_1_s_sdk_crypt_sdk=3b3dcfc8-465d-ab57; bd_ticket_guard_client_web_domain=2; sdk_source_info=7e276470716a68645a606960273f276364697660272927676c715a6d6069756077273f276364697660272927666d776a68605a607d71606b766c6a6b5a7666776c7571273f275e58272927666a6b766a69605a696c6061273f27636469766027292762696a6764695a7364776c6467696076273f275e582729277672715a646971273f2763646976602729277f6b5a666475273f2763646976602729276d6a6e5a6b6a716c273f2763646976602729276c6b6f5a7f6367273f27636469766027292771273f273c313c363d3630343635303234272927676c715a75776a716a666a69273f2763646976602778; bit_env=DgsGy7lwJBK7ELlB8d1srtl1Fp3Al0qYYSDlG-Kyw7HgIQS9iEUpPke_4TXXKRD1NH5Fq_CmoWfdTGGF0YU5Q0OOOOLbpAaCnhf9a5jJlrxXgbR1vluMjDEj4tgbgt3XLNYoyaKSpaJw60_-LAUXEcIzzWu3kjZs2QwWg9unzcz18_ZlM5ORdwp9gemIAtaLDe2hvtBL-96urYg9Hu8ixGa7NNXseTe_XEucPYz2vm1q2HKK7Nt2M39EHU9WhaVQBhZEydkSgkWH1WrhzyUKiaGpikwiJ9pMfBa4LgPlwxOuiBhYdHUW4IjsCxTzJ5QpS1O0cgpr4SK9YdUEsRXEcufeVStejdmnh1k1Mg6C9oq2enEGJpJzIq4I57-px4PWPM55V6DxdgxTFkzGGwTwdElS0wY1JC3ErbnXoTbnkERKo4hoJLlmMtHWlppXo_EUZ5dGfE8k4qUe589t0uPrvA54yBis55zU87894cuNphaJ4IYrAOD8dS_QHKMbpRXh; gulu_source_res=eyJwX2luIjoiODE4ZmQ4N2E4MDc2ZjQwYjA4ZjJiNjYwZTg5MGFhM2JmYTMyNTg1MzhhODVhZTBlYjZkM2M5YTZkNWU0ZDEzZCJ9; passport_auth_mix_state=15gcb5zt0hsqniwxbg4y544s3dvedmezakn1q2kodn0rhutx; passport_mfa_token=CjejUQrtDnjho7%2Bw9H09Th3hcj5ljBXBS87tzKAeh8jSV0kLyduoc3wIZUOYf51aEVL6Xe8ehE%2BpGkoKPAAAAAAAAAAAAABPImC67lBK98A1UL%2FQc56zi5wv54tKYIv%2Bk87m8uyyPaKxFo8GWTwlEn8MAsnx2cElOBCAwPQNGPax0WwgAiIBA%2BVDpf4%3D; d_ticket=01e86f4d00874bae849df0684c38d49824a9c; passport_assist_user=CkEphPWw6GX3V-5KEWHx46eD0UF3t19s1AjdmKhaJUY5G-kdOlZdhgDg5_dKpgXC6o8Mx7fT4vKxnG71I6du01fIKxpKCjwAAAAAAAAAAAAATyJifRJFnIUl3QTNUALjpBa3Ggu2QgL78uMNra7pZQC61o2TvjiUu7a2UiUgYBECONwQ_7_0DRiJr9ZUIAEiAQPgqwlI; n_mh=eqXmN5j3rEwkb5KLotqaAfE86BMyNnJR4Hma4B7ZUmw; sid_guard=5ca49582649de3b812cf4520f75ebc4c%7C1750315418%7C5184000%7CMon%2C+18-Aug-2025+06%3A43%3A38+GMT; uid_tt=b7a9c33ff85a5d03cc4cf47d48b6d8f4; uid_tt_ss=b7a9c33ff85a5d03cc4cf47d48b6d8f4; sid_tt=5ca49582649de3b812cf4520f75ebc4c; sessionid=5ca49582649de3b812cf4520f75ebc4c; sessionid_ss=5ca49582649de3b812cf4520f75ebc4c; session_tlb_tag=sttt%7C11%7CXKSVgmSd47gSz0Ug9168TP________-gQOXBB6U75HcXVX-MMC4xRb-KKQVM_tf6jlEIitpuUeU%3D; is_staff_user=false; sid_ucp_v1=1.0.0-KGI0NzQxZDc0YzI0MTEyZTgxNDViN2ZjNjc2MGU3OWQ4Yzk1MmUzZjcKIQj4ivD0y427BxCa487CBhjvMSAMMK_Tr54GOAdA9AdIBBoCbGYiIDVjYTQ5NTgyNjQ5ZGUzYjgxMmNmNDUyMGY3NWViYzRj; ssid_ucp_v1=1.0.0-KGI0NzQxZDc0YzI0MTEyZTgxNDViN2ZjNjc2MGU3OWQ4Yzk1MmUzZjcKIQj4ivD0y427BxCa487CBhjvMSAMMK_Tr54GOAdA9AdIBBoCbGYiIDVjYTQ5NTgyNjQ5ZGUzYjgxMmNmNDUyMGY3NWViYzRj; login_time=1750315408716; is_dash_user=1; publish_badge_show_info=%220%2C0%2C0%2C1750315409058%22; DiscoverFeedExposedAd=%7B%7D; UIFID=e71d819f1cb72e7166823ce125547a3e5a83b631a52f7c0b3c34cd9714dd602dbceb9ed539114bafbdc2825dca4d335a0713815200b8d09ee663f42c017c06cd67c8fa1b3a17645191657151493ad1cab2f1945b6c4018959e1f9cc644261ffed5774d2aab1ea6f58afc29395ddf211e3b407c2ff4fc1916d28118beba404494f273965974770f85ab1df06ef11ac166078c2412210dddf46b0cdc005cf348df; stream_recommend_feed_params=%22%7B%5C%22cookie_enabled%5C%22%3Atrue%2C%5C%22screen_width%5C%22%3A1920%2C%5C%22screen_height%5C%22%3A1080%2C%5C%22browser_online%5C%22%3Atrue%2C%5C%22cpu_core_num%5C%22%3A24%2C%5C%22device_memory%5C%22%3A8%2C%5C%22downlink%5C%22%3A10%2C%5C%22effective_type%5C%22%3A%5C%224g%5C%22%2C%5C%22round_trip_time%5C%22%3A150%7D%22; SelfTabRedDotControl=%5B%5D; _bd_ticket_crypt_cookie=a453f909ca86e769e1717c25df8a6792; __security_mc_1_s_sdk_sign_data_key_web_protect=1ace0e97-4527-a5f6; __security_mc_1_s_sdk_cert_key=de4a694c-4fdb-b599; __security_server_data_status=1; bd_ticket_guard_client_data=eyJiZC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwiYmQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJiZC10aWNrZXQtZ3VhcmQtcmVlLXB1YmxpYy1rZXkiOiJCSmErVzlCRFpmWVJnc0JYRmxKM0tMTTBXUzQ1eHUwNkhwdk95RG9rRFhXdXBNQXdDRnN3UmxuN2d4eFFmQStwMGZmQlMwL3BWbWJnZVU4U1dJaTBkazg9IiwiYmQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoyfQ%3D%3D; odin_tt=448118162ec4aad6db04d7c774b5d8030571242cc11c6a5ed60eead7f2d236eb73c7c427eb9b70d054b90c80dcf7ea5fd614b2f043025d5107dbe3e703fcd7f7; __ac_nonce=06853b1b200fb84a7a50e; __ac_signature=_02B4Z6wo00f01FCgF-wAAIDDzsS3fadVoqBQgBNAAHyDda; x-web-secsdk-uid=e7124e27-b926-47a0-adc2-63d19aaca33c; xgplayer_device_id=8278040272; xgplayer_user_id=498067034973; __live_version__=%221.1.3.4367%22; has_avx2=null; device_web_cpu_core=24; device_web_memory_size=8; webcast_local_quality=null; live_can_add_dy_2_desktop=%220%22; live_use_vvc=%22false%22; csrf_session_id=7b889515d437499a16c3f2f4ceea0177; IsDouyinActive=true; fpk1=U2FsdGVkX1/JU0DuVK5G55mJnqq4kq6zX8g275peeHGME+or+wyCLEROh3GwB4p1ZAgIOwKPC19ISHAECjnXQg==; fpk2=0fe6feb54289f4c67027ec06cc2131f8";
    const goods = await fetchLiveRoomProductResult(room_id, author_id, cookies);
    console.log({ goods });
}

main();
